import Backbone from 'backbone';
import React from 'react';
import ReactDom from 'react-dom';
import UserModel from './resources/model';
import UserCollection from './resources/collection';
import $ from 'jquery';
import UserTemplate from './resources/user_template';
import _ from 'underscore';
import HomeTemplate from './router_pages/home_page';
import PreviewTemplate from './router_pages/preview';
import HomeTop from './resources/home_top';
import AddPicture from './router_pages/add_pic'
let Router = Backbone.Router.extend({

  routes: {
    ""      : "showHome",
    "detail"  : "showDetail",
    "add": "showAdd",
    "wat": "wat",
    "preview/:id": "preview",
    "add": "addPic"
  },

  initialize(appElement) {
    this.el = appElement;
    this.users = new UserCollection();
    let router = this;
  },
  goto(route) {
    this.navigate(route, {
      trigger: true
    });
  },

  render(component) {
    ReactDom.render(component, this.el);
  },

  start() {
    Backbone.history.start();
    return this;
  },

  showHome() {
      ReactDom.render(<HomeTop addPic={()=>this.goto(`add`)}/>, document.querySelector('.top'))
    this.users.fetch().then(()=>{
      ReactDom.render(<HomeTemplate tacoSteak = {this.users.toJSON()}  
      goSingleView={(id)=>this.goto(`preview/${id}`)}/>, document.querySelector('.app'));
      
    });
  },
  preview(id){
    console.log(id);

    let dumpster = this.users.toJSON().find(item=>item.objectId === id)
    console.log(dumpster);
    
    ReactDom.render(<PreviewTemplate thumbnail ={dumpster.image}
    thumbTitle={dumpster.userName} 
    cap={dumpster.caption}
    likePic={()=>{
      let picLike = new UserModel({
        likes: dumpster.likes+1,
        objectId: dumpster.objectId
      });
       picLike.save();    
    }}
    goback={()=>this.goto(`/`)}/>, document.querySelector('.app'));

  },
  addPic(){
    ReactDom.render(<AddPicture savePicture={()=>{
    let name = document.querySelector('.nameInput').value;
    let imgUrl = document.querySelector('.imgInput').value;
    let newCap = document.querySelector('.captionInput').value;
    let newPic = new UserModel({
      userName: name,
      image: imgUrl,
      caption: newCap,
      likes: 0
    });
    newPic.save();
    this.goto(`/`);

    }
    }/>, document.querySelector('.app'));
  }

});

export default Router;