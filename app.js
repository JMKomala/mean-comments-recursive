

angular.module('appName', [])

angular.module('appName')
    .controller('myController', function () {
        var $ctrl = this;
        $ctrl.text = "Hello World";
        $ctrl.todo;
        $ctrl.todoArray = []
        $ctrl.addTodo = () => {
            if (this.todo) {
                $ctrl.todoArray.push($ctrl.todo)
                $ctrl.todo = "";
                console.log($ctrl.todoArray)
            }
        }

        $ctrl.removeTodo = (idx) => {
            $ctrl.todoArray.splice(idx, 1)
            console.log($ctrl.todoArray)
        }

    });


