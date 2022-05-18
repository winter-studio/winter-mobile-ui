import { App } from 'vue'
import {
  Button,
  List,
  Cell,
  Tabbar,
  TabbarItem,
  Swipe,
  SwipeItem,
  Grid,
  GridItem,
  NavBar,
  Icon,
  Sticky,
  Card,
  Sidebar,
  SidebarItem
} from 'vant'

const plugins = [
  Button,
  List,
  Cell,
  Tabbar,
  TabbarItem,
  Swipe,
  SwipeItem,
  Grid,
  GridItem,
  NavBar,
  Icon,
  Sticky,
  Card,
  Sidebar,
  SidebarItem
]

export default {
  install: function (app: App) {
    plugins.forEach((item) => {
      // app.component(item.name, item);
      app.use(item)
    })
  }
}
