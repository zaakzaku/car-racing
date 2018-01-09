var express = require('express');

var user={
  getAllUser:function(callback){
    return connection.query("SELECT * from users",callback);
  },
  getUserById:function(id,callback){
    return connection.query("select * from users where id=?",[id],callback);
  },
  addUser:function(user,callback){
    console.log("inside service");
    return connection.query("Insert into users values(?,?,?)",[user.id,user.name,user.profile],callback);
  }
/*
  deleteTask:function(id,callback){
    return db.query("delete from task where Id=?",[id],callback);
  },

  updateTask:function(id,Task,callback){
    return  db.query("update task set Title=?,Status=? where Id=?",[Task.Title,Task.Status,id],callback);
  },
  deleteAll:function(item,callback){

    var delarr=[];
    for(i=0;i<item.length;i++){

      delarr[i]=item[i].Id;
    }
    return db.query("delete from task where Id in (?)",[delarr],callback);
  }
};
*/
};
module.exports = user;
