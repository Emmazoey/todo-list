window.onload = function () {
    var listStorage = {
        fetch: function() {
          var list = JSON.parse(localStorage.getItem("todoList") || "[]");
          console.log("get localStorage:",list)
          return list;
        },
        save: function(list) {
          localStorage.setItem("todoList", JSON.stringify(list));
        }
      };

    var vm = new Vue({
        el: '#app',
        data: {
            inputText:'',
            editing:false,
            list:listStorage.fetch(),
            showOption:'all',
            editItem:null
        },
        computed:{
            filteredList: function() {
                if(this.showOption == 'all'){
                    return this.search(this.list);
                }else if(this.showOption == 'finish'){
                    return this.search(this.list.filter(function(item) {
                        return item.isFinish;
                    }));
                }else{
                    return this.search(this.list.filter(function(item) {
                        return !item.isFinish;
                    }));
                }
            },
        },
        directives: {
            "item-focus": function(el, binding) {
                if (binding.value) {
                el.focus();
                }
            }
        },
        watch: {
            list: {
                handler: function(list) {
                    console.log("watch save localStorage:",list)
                    listStorage.save(list);
                },
                deep: true
            },
        },
        methods: {
            //搜索
            search(data){
                if(this.inputText == ''){
                    return data
                }
                return data.filter(item => {
                    return item.content.indexOf(this.inputText) != -1;
                });
            },
            //添加一条待办
            addItem(){
                if(this.inputText == ''){
                    alert('请输入待办内容')
                    return
                }
                this.list.push({
                    id:( new Date()).valueOf(),
                    content:this.inputText,
                    isFinish:false,
                }),
                this.inputText = ''
            },
            //删除一条待办
            delItem(item){
                console.log('del item:',item)
                for (var i = 0; i < this.list.length; i++) {
                    if (this.list[i].id == item.id) {
                        break;
                    }
                }
                if(i != this.length){
                    this.list.splice(i, 1);
                }
            },

            changeOption(data){
                this.showOption = data
            },


            //双击编辑
            toEdit(item){
                this.editCache = item.content;
                this.editItem = item;
            },
            doneEdit(item){
                if (!this.editItem) {
                    return;
                }
                this.editItem = null;
                item.content = item.content.trim();
                if (!item.content) {
                    this.delItem(item);
                }
            }
        },
    })

    
}
