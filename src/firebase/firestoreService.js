import {
  collection,
  doc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  onSnapshot,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from './config';

export const DATA_COLLECTIONS = ['tasks','habits','notes','expenses','goals','stories','opportunities'];
export const INITIAL_DATA = {
  tasks: [],
  habits: [],
  notes: [],
  expenses: [],
  goals: [],
  stories: [],
  opportunities: []
};

const getLocalKey = (userId, collectionName) => `tr_mgmt_${userId}_${collectionName}`;
const requireOwner = (userId) => {
  if (!userId || userId.startsWith('tushar_demo') || userId.startsWith('guest')) {
    throw new Error('A signed-in owner account is required to use cloud LifeOS data.');
  }
};
const readCache = (userId, collectionName) => {
  try {
    return JSON.parse(localStorage.getItem(getLocalKey(userId,collectionName)) || '[]');
  } catch {
    return [];
  }
};
const writeCache = (userId, collectionName, items) => {
  try {
    localStorage.setItem(getLocalKey(userId,collectionName),JSON.stringify(items));
  } catch (error) {
    console.warn('LifeOS cache could not be updated:',error);
  }
};

export function subscribeCollection(userId, collectionName, callback) {
  if (!userId) {
    callback([]);
    return () => {};
  }
  const colRef = collection(db,'users',userId,collectionName);
  return onSnapshot(colRef,(snapshot)=>{
    const items=snapshot.docs.map(item=>({id:item.id,...item.data()}));
    writeCache(userId,collectionName,items);
    callback(items);
  },(error)=>{
    console.error('Firestore listener failed for '+collectionName+':',error);
    // IndexedDB persistence handles normal offline reads. Use a last-synced cache only
    // for transient network loss; permission errors must never expose stale local data.
    if(error?.code==='unavailable' || error?.code==='deadline-exceeded'){
      callback(readCache(userId,collectionName));
    }else{
      callback([]);
    }
  });
}

export async function addItem(userId,collectionName,item) {
  requireOwner(userId);
  if(!DATA_COLLECTIONS.includes(collectionName))throw new Error('Unsupported LifeOS collection.');
  const newItem={...item,createdAt:item.createdAt||new Date().toISOString()};
  const colRef=collection(db,'users',userId,collectionName);
  const docRef=await addDoc(colRef,{...newItem,serverTime:serverTimestamp()});
  const saved={...newItem,id:docRef.id};
  const cache=readCache(userId,collectionName);
  writeCache(userId,collectionName,[saved,...cache.filter(x=>x.id!==saved.id)]);
  return saved;
}

export async function updateItem(userId,collectionName,id,updates) {
  requireOwner(userId);
  if(!DATA_COLLECTIONS.includes(collectionName))throw new Error('Unsupported LifeOS collection.');
  const docRef=doc(db,'users',userId,collectionName,id);
  await updateDoc(docRef,updates);
  const items=readCache(userId,collectionName).map(item=>item.id===id?{...item,...updates}:item);
  writeCache(userId,collectionName,items);
}

export async function deleteItem(userId,collectionName,id) {
  requireOwner(userId);
  if(!DATA_COLLECTIONS.includes(collectionName))throw new Error('Unsupported LifeOS collection.');
  await deleteDoc(doc(db,'users',userId,collectionName,id));
  writeCache(userId,collectionName,readCache(userId,collectionName).filter(item=>item.id!==id));
}

export async function exportAllData(userId) {
  requireOwner(userId);
  const result={exportedAt:new Date().toISOString(),owner:userId};
  for(const collectionName of DATA_COLLECTIONS){
    const snapshot=await getDocs(collection(db,'users',userId,collectionName));
    result[collectionName]=snapshot.docs.map(item=>({id:item.id,...item.data()}));
    writeCache(userId,collectionName,result[collectionName]);
  }
  const mission=await getDoc(doc(db,'users',userId,'lifeos_mission','primary'));
  result.lifeos_mission=mission.exists()?mission.data():null;
  return JSON.stringify(result,null,2);
}

export async function importAllData(userId,jsonString) {
  requireOwner(userId);
  const parsed=JSON.parse(jsonString);
  const accepted=DATA_COLLECTIONS.filter(name=>Array.isArray(parsed[name]));
  for(const name of accepted){
    const list=parsed[name];
    for(let start=0;start<list.length;start+=400){
      const batch=writeBatch(db);
      list.slice(start,start+400).forEach(item=>{
        const {id,...data}=item;
        const ref=id?doc(db,'users',userId,name,String(id)):doc(collection(db,'users',userId,name));
        batch.set(ref,{...data,restoredAt:new Date().toISOString()},{merge:true});
      });
      await batch.commit();
    }
  }
  if(parsed.lifeos_mission && typeof parsed.lifeos_mission==='object'){
    await setDoc(doc(db,'users',userId,'lifeos_mission','primary'),parsed.lifeos_mission,{merge:false});
  }
  return true;
}

export async function clearAllUserData(userId) {
  requireOwner(userId);
  for(const collectionName of DATA_COLLECTIONS){
    const colRef=collection(db,'users',userId,collectionName);
    const snapshot=await getDocs(colRef);
    for(let start=0;start<snapshot.docs.length;start+=400){
      const batch=writeBatch(db);
      snapshot.docs.slice(start,start+400).forEach(item=>batch.delete(item.ref));
      await batch.commit();
    }
    writeCache(userId,collectionName,[]);
  }
  await deleteDoc(doc(db,'users',userId,'lifeos_mission','primary'));
}
