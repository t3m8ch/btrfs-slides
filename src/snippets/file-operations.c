struct file_operations {
    /* ... */
    ssize_t (*read_iter)(struct kiocb *,
                         struct iov_iter *);

    ssize_t (*write_iter)(struct kiocb *,
                          struct iov_iter *);
    /* ... */
    int (*open)(struct inode *, struct file *);
    /* ... */
};
