// Здесь дата преврашается (впечатывается) из ветвистой структуры объекта в 2ух мерный массив
// Происходит это в 2 этапа: 1ый - рекурсивныей серийник, который пропускает через себя объект и накидывает
// Буст (высоту элемента в сетке массива):
// 2ой этап это создание пустого массива на основе инфы по макс высоте и длине -->
// повторный обход даты и модифицирование this.grid на основе локальныйх данных переключение режимов через 
// флаги isBoost, isModif

// Код более чем производителен.
export default function () {
  this.addEventListener("message", function(ev) {
    if(!ev) return;
    debugger
    class TreeRecer {
      constructor(data) {
        console.log("INSIDE:",data)
        this.superData = data; // источник даты, которые модифится, 
        this.boost = 0;
        this.maxPath = '';
        this.grid = []; // просто плаг
      }
  
      promiseLessSeries(arrOfFunc) { // последовательный вызов (Хз чего я боюсь, просто с этим спокойней)
        let i = 0;
        while(i < arrOfFunc.length) {
          arrOfFunc[i]();
          i++;
        }
      };
      async checker(isModif, isBoost, data = this.superData) { // проверяет есть ли в дате вопросы
        // и действует в зависимости от ситуации)
        ///debugger
        let branch = data.branch; 
        let context = this;
        let choses = branch.choseCount; // число вопросов в ветке.
        let sery = []; // здесь собираются функции.
        let i = 0

        isModif && this.findAndSet({path: data.pos, height: branch.boost, data})

        if(choses !== 0) { // если есть вопросы, то создается новыя серия(данные по адрессам вопрос)
          // и прогоняетяс через чекер
          while(i < choses) {
            sery.push(branch['q'+i])
            i++
          }
          let funcArr = sery.map((branch, i) => {
            return function() {
              this.checker(isModif, isBoost, branch)
            }.bind(context)
          });
          this.promiseLessSeries(funcArr) // проход в другие ветки

          isBoost && (() => { // поиск исключения нижней ветки (она всегда прежата ко дну) 
            if(data.pos.split('').every(el => el==="0")) { // check if this bottom
              branch.boost = 0;
            } else { // прокидывание буста в те позиции, где есть есть вопросы ---> зависимость от центрального элемента
              branch.boost = branch['q'+~~((choses%2===0 ? (choses-1) : choses)/2)].branch.boost;
            };
          })()


        } else { // наткнулся на ласт элемент, в котором нет вопроса, просто база
        
          isBoost && (() => { // 
            branch['boost'] = this.boost; // стандартный буст
            this.boost++;
            if(this.maxPath.length < data.pos.length) { // проверка на максимальную длину ветки
              this.maxPath = data.pos
            }
          })()
          //console.log(this)
        };
        
      }
  
      updater() {
        this.checker(false, true).then(() => {
          // создание сетки на основе предельных данных this.boost (высота) и this.maxPath (ширина)
          this.grid = Array(this.boost).fill('').map(() => []).map(() => Array(this.maxPath.length).fill('').map(() => ({data: null})));
          debugger
          this.checker(true, false).then(() => {
            this.grid = this.grid.reverse();

            postMessage({grid: this.grid})
          })
        })
          
      }

      findAndSet({path, height, data}) {
        this.grid[+height][path.length-1].data = data;
      }
    }

    new TreeRecer(ev.data).updater()

    //console.log("MAP_EV:", ev)
    //new TreeRecer({})

  })
}

