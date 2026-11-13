# v1.2.0 source archive

This folder contains the complete WordPress plugin source package, encoded as seven base64 text parts so the source can be restored from GitHub without a binary release upload.

## Reconstruct

From the repository root:

```bash
cat wordpress-plugin/source-v1.2.0/part-00.txt \
    wordpress-plugin/source-v1.2.0/part-01.txt \
    wordpress-plugin/source-v1.2.0/part-02.txt \
    wordpress-plugin/source-v1.2.0/part-03.txt \
    wordpress-plugin/source-v1.2.0/part-04.txt \
    wordpress-plugin/source-v1.2.0/part-05.txt \
    wordpress-plugin/source-v1.2.0/part-06.txt \
  | tr -d '\n' | base64 -d | tar -xz
```

Expected SHA-256 of the reconstructed `eagle-structure-lifeos-source-v1.2.0.tar.gz`:

`77293fbb92ca437d3d06203dae5ab3ff617e65fc44ed9c218c187ec860a42231`

The archive extracts the `eagle-structure-lifeos/` plugin directory, containing the PHP plugin, JavaScript, CSS and README. The installable WordPress ZIP is also provided in this conversation.
