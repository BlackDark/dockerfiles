# ZSTD

```bash
# zstd with tar. Native busybox alpine tar does not support zstd
tar c /mnt | zstd -o test.tar.zst
```
