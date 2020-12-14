import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

const routes = [

{
  path:"/main",
  name:"Main",
  component:()=> import("../views/Main.vue"),
  children:[
    {
      path:"home",
      name:"Home",
      component:()=> import("../views/Home.vue"),
      meta: {
        keepAlive: true // 需要被缓存
      }
    },
    {
      path:"categories",
      name:"Categories",
      component:()=> import("../views/Categories.vue"),
      meta: {
        keepAlive: true // 需要被缓存
      }
    },
    {
      path:"rank",
      name:"Rank",
      component:()=> import("../views/Rank.vue"),
      meta: {
        keepAlive: true // 需要被缓存
      },
    },
    
   
    {
      path:"bookLists",
      name:"BookLists",
      component:()=> import("../views/BookLists.vue"),
      children:[
        {
          path:'bookLists/:id',
          name:"BookLists/:id",
          component:()=> import('../components/booklist-detail.vue')
        }
      ],
      meta: {
        keepAlive: true // 需要被缓存
      }
    },
    
  ]
},
      {
      path:"/categories/detail",
      name:"/Category-detail",
      component:()=> import("../views/Category-detail.vue")
      },
      {
        path:'/rank/:id',
        name:'/Rank-detail',
        component:()=>import('../views/Rank-detail.vue'),
        meta: {
          keepAlive: true // 需要被缓存
        }
      },
      {
        path:"/search",
        name:"/Search",
        component:()=> import("../views/Search.vue")
      },
      {
        path:'/readBook/:id/',
        name:"/readBook",
        component:() => import("../components/readBook.vue"),
        meta: {
          keepAlive: false // 不需要被缓存
        }
      },
      {
        path:'/book/:id',
        name:'/book-detail',
        component:()=> import("../components/book-detail.vue"),
        meta: {
          keepAlive: true // 需要被缓存
        }
      },

      {
        path:"*",
        redirect:{
          name:"Home"
        }
      }
 
]

const router = new VueRouter({
  routes
})

export default router
