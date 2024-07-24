# Postgraduate Task

You need to submit your completed work to this warehouse, and when you complete the specified task, you will receive the target reward.

This repository will show the completion status of your tasks, so that you can clearly understand what you have done.

## Usage:

In the first time you should run the following command in your project root directory to get the lastest tasks:
```bash
git pull origin main
```

After you have finished your tasks, you should the following command to submit you works:
```bahs
# store in local storage
git add .

# submit to the local storage
git commit -m "describe about this commit"

# push to the remote(I will check your commit in the remote)
git push origin main
```

You can use the following commands to verify the submit is success or not:
```bash
# this command will display the files changed but not add/commit
git status

# this command will display your commit logs
git log
``` 

If you want to see more about git, the website you can click: https://gitee.com/progit/

*You should submit your completed work(maybe screenshrot or picture or word file) to the **tasks** directory.*
