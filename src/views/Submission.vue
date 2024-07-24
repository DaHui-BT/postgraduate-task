<script setup lang="ts">
import { reactive } from "vue";

const submission_status = ['submit', 'checked', 'awarded']
const submission_status_color = ['#8b13e7', '#13e7c0', '#136fe7']

const submission_list = reactive<{
  date: string,
  message: string,
  status: number,
  link: string
}[]>([])

submission_list.push({
  date: "2024-02-23",
  message: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere dolor maxime vitae veritatis ipsa expedita iure, consequuntur praesentium ad nulla quis! Autem dolorem odit quia ratione consequatur neque quod ad.",
  status: 1,
  link: ""
})
submission_list.push({
  date: "2024-02-23",
  message: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere dolor maxime vitae veritatis ipsa expedita iure, consequuntur praesentium ad nulla quis! Autem dolorem odit quia ratione consequatur neque quod ad.",
  status: 0,
  link: ""
})
submission_list.push({
  date: "2024-02-23",
  message: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere dolor maxime vitae veritatis ipsa expedita iure, consequuntur praesentium ad nulla quis! Autem dolorem odit quia ratione consequatur neque quod ad.",
  status: 2,
  link: ""
})

submission_list.push({
  date: "2024-02-23",
  message: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere dolor maxime vitae veritatis ipsa expedita iure, consequuntur praesentium ad nulla quis! Autem dolorem odit quia ratione consequatur neque quod ad.",
  status: 1,
  link: ""
})
submission_list.push({
  date: "2024-02-23",
  message: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere dolor maxime vitae veritatis ipsa expedita iure, consequuntur praesentium ad nulla quis! Autem dolorem odit quia ratione consequatur neque quod ad.",
  status: 0,
  link: ""
})
submission_list.push({
  date: "2024-02-23",
  message: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere dolor maxime vitae veritatis ipsa expedita iure, consequuntur praesentium ad nulla quis! Autem dolorem odit quia ratione consequatur neque quod ad.",
  status: 2,
  link: ""
})
</script>

<template>
  <div class="submission">
    <h1>This is an submission page</h1>

    <ul class="submission-content">
      <li class="submission-item" v-for="submission in submission_list" :key="submission.date">
        <div class="submission-func">
          <div class="submission-status" :style="{'backgroundColor': submission_status_color[submission.status]}">
            {{ submission_status[submission.status] }}
          </div>
          <div class="submission-date">{{ submission.date }}</div>
        </div>
        <div class="submission-message">{{ submission.message }}</div>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.submission {
  width: 900px;
  min-height: calc(100vh - 60px);
  margin: auto;
  padding: 10px 20px;
  border-radius: 10px;
  background-color: #fff;
  box-shadow: 0px 3px 10px #d2d2d2;
  margin-bottom: 30px;

  .submission-content {

    .submission-item {
      margin-bottom: 20px;
      padding: 10px 20px;
      border-radius: 10px;
      border-bottom: 1px solid #eee;
      box-shadow: 0px 0px 10px #eee;
      list-style: none;

      .submission-func {
        display: flex;
        justify-content: space-between;

        .submission-status {
          padding: 2px 5px;
          color: #fff;
          border-radius: 3px;
        }

        .submission-date {
          text-align: right;
          font-size: 13px;
          color: #aaa;
        }
        
      }

      .submission-message {
        color: #666;
      }
    }
  }
}
</style>
