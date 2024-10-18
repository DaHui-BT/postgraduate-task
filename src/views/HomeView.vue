<script setup lang="ts">

</script>

<template>
  <div class="home">
    <div class="describe">
      <h1>Postgraduate Task</h1>
      <p>You need to submit your completed work to this warehouse, and when you complete the specified task, you will receive the target reward.</p>
      <p>This repository will show the completion status of your tasks, so that you can clearly understand what you have done.</p>

      <h2>Tasks:</h2>
      <blockquote class="task-list">
        <li class="task-list-item">Advance Math: 10 pages / day</li>
        <li class="task-list-item">Probability theory: 4 pages / day</li>
        <li class="task-list-item">Linear algebra: 5 pages / day</li>
        <li class="task-list-item">1000 Questions finish after listening the course: 1 course / day</li>
        <li class="task-list-item">660 finish after listening the course: 1 course / day</li>
        <li class="task-list-item">Exercise book after listening the course: 10pages / day</li>
        <li class="task-list-item">Mr Wu Teaching material: course / day</li>
        <li class="task-list-item">English words: 2 units / day</li>
        <li class="task-list-item">English reading: 2 pieces / day</li>
        <li class="task-list-item">Network course: 2 course / day</li>
        <li class="task-list-item">Network book: 20 pages / day</li>
        <li class="task-list-item">Software engineering book: 10 pages / day</li>
      </blockquote>

      <h2>Usage:</h2>
      <p>1. In the first time you should run the following command in your project root directory to get the lastest tasks:</p>
      <pre>
        git pull origin main
      </pre>
      <p>2. You should submit your completed work to the tasks directory.</p>
      
      <p>3. After you have finished your tasks, you should the following command to submit you works:</p>
      <pre>
        # store in local storage
        git add .

        # submit to the local storage
        git commit -m "submit: describe about this commit"

        # push to the remote(I will check your commit in the remote)
        git push origin main
      </pre>

      <p>4. You can use the following commands to verify the submit is success or not:</p>
      <pre>
        # this command will display the files changed but not add/commit
        git status

        # this command will display your commit logs
        git log
      </pre>

      <p>If you want to see more about git, the website you can click: <a target="_blank" href="https://gitee.com/progit/">https://gitee.com/progit/</a></p>

      <i>You should submit your completed work(maybe screenshrot or picture or word file) to the <strong>tasks</strong> directory.</i>
    </div>

  </div>
</template>

<style lang="scss" scoped>
.home {
  padding-bottom: 30px;

  .describe {
    text-align: left;
  }
}
</style>
