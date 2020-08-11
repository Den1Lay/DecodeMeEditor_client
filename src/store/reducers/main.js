// Возможно тебе пригодится это когда ты вернешься спустя какое то время.. Проведи его АХУЕНННО!!
// Рабочий процесс крутиться вокруг переменной workBranch, которая за счет модицирования project позволят редактировать ВСЕ
// Главное это правильно выделить ее из нужно проекта, в этом тебе помогут mineInd и pathReducer. В дальнейшем рабочая вертка 
// взаимодействует с ProjectsCoordsData, из которой так же выделяется рабочий объект на основании прошлых проектов, юзеров.
// Этот рабочий объект ответсвеннен за рабочую ветку и высоту. PCD хранит в себе данных проектов ВСЕХ Юзеров к которым ты притрагивался
// При работе на акке друга детаются новые данные и происходит привязка к его комнате с последующей прослушкой всех его действий
// отлавливанием их сокетами в core и модификацией... 
// Все данные имеют обратную совместимость так что баги с невозможностью найти индекс не должные происходить...
// Только специально обрабатываемые.. при удалении.. Тоесть только 90 % таких событий должно быть отловлено в INIT подобных событиях
// Не подгорай :)

// Логика сеттеров начала прижимать фундаментальную диспатчевую логику. О БАЛ ДЕТЬ. смотри на работу илююстраций
import {format, startOfWeek} from 'date-fns';
import {v4} from 'uuid'
import FastClone from 'fastest-clone'
import {mineInd, openNotification} from '@/utils'

const projectsCoordData = [
  {
    projectId: 'uuid11',
    workVersion: "uuid12",
    "uuid12": {
      path: "0",
      height: 0
    }
  }
]
// просто манекены..
// обновлять персон обжект здесь или получать новый с сервера... (я беру с сервера..) ..почистить код
const projects = [{
  name: "QWE",  
  description: "QWE",
  superId: 'uuidentificator',
  lastVersion: 0, // proj v || wb v
  versions: [{
  comment: 'Init',
  date: format(new Date(), "yyyy-MM-dd"),
  superId: 'uuid12',
  master: 'NickName',
  data: {
    pos: "0",
    branch: {
    branchDirection: '',
    base: [{
      coord: {
        path: "0",
        height: 0
      },
      label: '',
      main: '',
      comment: '',
      picture: {
        src: null,
        alt: ''
      }
    }],
    question: false,
    choseCount: 0,
    }
  }
}]}]

const defState = {
  projectsCoordsData: [], // набор джентельмена
  projects: false,
  workPerson: null,
  workPCD: null,
  workBranch: null,
  // currentBranch: "0",
  // currentProject: 0,
  // currentVersion: 0,
  // currentHeight: 0,
  // workProject: 0,
  availablePayload: null,
  users: [], // all exist users
  personObj: null, // Всегда можно найти себя по этому адресу..
  friends: [],
  mainPlace: 'editor', // project save
}
let date = format(new Date(), "yyyy-MM-dd"); 
export default (state = defState, action) => {
  const {type, payload, random} = action;
  function updatPersonObj() {
    if(state.workPerson === state.personObj.userData.superId) {
      state.personObj.projects = state.projects;
      state.personObj.projectsCoordsData = state.projectsCoordsData;
    }
  }
  switch(type) {
  
    case 'ADD_PROJECT': //wb.v
    //disavaible middleware модификация pcd..
      return (() => {
        debugger
        const {name, description, access, superAccess} = payload
        state.projects.unshift({
          name,  
          description,
          superId: v4(), 
          access,
          superAccess,
          versions: [{
          comment: 'Init',
          date,
          superId: v4(),
          master: null,
          illustrations: [],
          data: {
            pos: "0",
            branch: {
            branchDirection: '',
            base: [{
              coord: {
                path: "0",
                height: "0"
              },
              label: '',
              main: '',
              comment: '',
              picture: {
                src: null,
                alt: ''
              }
            }],
            question: false,
            choseCount: 0,
            }
          }
        }]});
        let firstVSId = state.projects[0].versions[0].superId;
        state.workPCD = {
          projectId: state.projects[0].superId,
          workVersion: firstVSId,
          [firstVSId]: {
            path: "0",
            height: "0"
          }
        };
        state.projectsCoordsData = [state.workPCD].concat(state.projectsCoordsData);
        state.workBranch = state.projects[0].versions[0].data;
        state.personObj.userData.myLastProject = state.projects[0].superId;
        state.mainPlace = 'editor';
        state.workBranch.v = 'n'+random;

        //ТОТ САМЫЙ ОТДЕЛЬНЫЙ ХЕНДЛЕР
        //updatPersonObj()
          return {
            ...state,
          }
      })();
    case 'SETUP_PROJECT':
      debugger
      return (() => {
        console.log(payload)
        const {name, description, access, superAccess} = payload

        let projectInd;
        for(let i in state.projects) {
          if(state.projects[i].superId === state.workPCD.projectId) {
            projectInd = i;
          }
        };
        function checkId(source, target, store) {
          source.forEach(id => {
            if(!target.includes(id)) {
              store.push(id)
            }
          })
        }
        let kicked = [];
        let superKicked = [];
        let newObservers = [];
        let newEditord = [];
        // let all = [];
        // let superAll = [];
        checkId(state.projects[projectInd].access, access, kicked);
        checkId(state.projects[projectInd].superAccess, superAccess, superKicked);
        checkId(access, state.projects[projectInd].access, newObservers);
        checkId(superAccess, state.projects[projectInd].superAccess, newEditord);
       
        state.projects[projectInd] = {...state.projects[projectInd], name, description, access, superAccess};
        state.workBranch.v = 's'+random;
        state.mainPlace = 'editor';

        return {
          ...state,
          kicked,
          superKicked,
          newObservers,
          newEditord
        }
      })()
    case 'OPEN_PLACE': 
      return {
        ...state,
        mainPlace: payload
      }
    case 'CLEAN_APPLICANT_LIST':
      return (() => {
        debugger
        //payload = superId;
        state.personObj.userData.applicantList = state.personObj.userData.applicantList.filter(({superId}) => superId !== payload)
        console.log(state.personObj.userData.applicantList);
        return state
      })()
    case 'UPDATE_APPLICANT_LIST': // updateApplicantList
      return (() => {
        //payload = user || obj.userData
        state.personObj.userData.applicantList.push(payload);
        return {
          ...state
        }
      })()
    case 'UPDATE_DATA': 
      // {payload, address, dlsInfo} = payload
      debugger
      // ВСЕ ЭТИ ВЕЩИ МОГУТ ОТРАБОТАТЬ ПРИ КОМНАТЕ ВЫБОРА... 
      // Я НЕ ОБНОВЛЯЮ этот стафф. просто произвожу повторный запрос, если есть Подтверждающий клик.    
      // прослушка своего объекта не прекращается!!! --> проводишь обновления

      // А что будет, если ты отключишься 
      // Вся логика UPDATE даты построена вокруг того, что ТЫ сейчас работаешь над ним, и
      // и что сейчас ты находишься в рабочем юзере.. ----> При переключении проекты меняются и куда 
      // улетят эти данные (никуда, индекс не найдется) не известно... Поэтому обновление данные происходит только в лайв
      // режиме. А переключение на себя будет происходить только после гетта полного стека свежих данных.
      
      // больше не делай таких вредных обработчиков
      return (() => { 
        let {data, address, dls} = payload;
        let connected = state.workPerson === data.person 
        switch(address) {
          case 'friend': //  отрабатывает при пике юзера в социальном компоненте 
            (() => {
              let {userData, projects} = data;
              let friendInd = [];
              mineInd(state.friends, userData.superId, ['userData','superId'], friendInd);
              state.friends[friendInd[0]].projects = projects;
              state.friendV = random;
            })()
          break;
          case 'projects':
            (() => {
            })()
          break;
          case 'versions':
            connected && (() => {
              let {person, projectId, versionId, workVersion} = data
              // Если ты находишь в другом проекте или версии...
              // update version;
              let projectInd = [];
              mineInd(state.projects, projectId, 'superId', projectInd);

              let versionInd = [];
              mineInd(state.projects[projectInd[0]].versions, versionId, 'superId', versionInd);

              state.projects[projectInd[0]].versions[versionInd[0]].data = workVersion; 
              // нужно ли обновлять workBranch? Da
              let realProjectInd = [];
              mineInd(state.projects, state.workPCD.projectId, 'superId', realProjectInd);
              let realVersionInd = [];
              mineInd(state.projects[realProjectInd[0]].versions, state.workPCD.workVersion, 'superId', realVersionInd);
              state.workBranch = state.projects[realProjectInd[0]].versions[realVersionInd[0]].data;

              let path = state.workPCD[state.workPCD.workVersion].path.substring(1);
              pathReducer(path, state);
              state.workBranch.v = random;
            })()
          break;
          case 'available': 
          connected && (() => {
            // ПРодумай как фильтрить это..
            let {person, workPCD, pass} = data; // Хаю хай тут баг, кста, когда чел будет в комнате выбора, 
            // он может получить этот вызов и ничего не обновить... Безотказная система падет.
            // можно обходить это простой проверкой на рабочего чела, который добывается в персоне сверху
            let projectInd = [];
            mineInd(state.projects, workPCD.projectId, 'superId', projectInd);
    
            let versionInd = [];
            mineInd(state.projects[projectInd[0]].versions, workPCD.workVersion, 'superId', versionInd);

            state.projects[projectInd[0]].versions[versionInd[0]].master = pass;
            
          })()
          break;
          // картинки должны находится в версии а не в проекте.. 
          case 'illustrations':
          connected && (() => {
            let {newIllust, action, workPCD} = data
            let projectInd = [];
            mineInd(state.projects, workPCD.projectId, 'superId', projectInd);

            let versionInd = [];
            mineInd(state.projects[projectInd[0]].versions, workPCD.workVersion, 'superId', versionInd);

            switch(action) {
              case 'ADD':
              state.projects[projectInd[0]].versions[versionInd[0]].illustrations.push(newIllust);
              break
              case 'REMOVE': 
              state.projects[projectInd[0]].versions[versionInd[0]].illustrations = state.projects[projectInd[0]].versions[versionInd[0]].illustrations.filter(({src}) => src !== newIllust.src);
              break
            }
            console.log('%c%s', 'color: pink; font-size: 24px;', 'UPDATED_ILLUS:', state.projects[projectInd[0]].versions[versionInd[0]].illustrations)
          })()
          break;
          default:
        }
        return state;
      })()
    case 'ACCESS_CONTROL': 
      //{event, pass} = payload
      //{projectId, superId} = pass 
      debugger
      return (() => {
        const {event, pass: {projectId, superId, all}} = payload;  // superId отправителя.
        // all - false, asBase 
        // Если алл тру, значит сейчас коннект с другим челом, который заредачил all, и этот ивент прилетел именно на его адрес,
        // и включился по этому.
        if(state.personObj.userData.superId === superId) {
          return state
        };
        let friendInd = [];
        mineInd(state.friends, superId, ['userData', 'superId'], friendInd);
        let projectInd = [];
        mineInd(state.friends[friendInd[0]].projects, projectId, 'superId', projectInd);
        const myId = state.personObj.userData.superId;
        let accessCopy = state.friends[friendInd[0]].projects[projectInd[0]].access.slice();
        let superAccessCopy = state.friends[friendInd[0]].projects[projectInd[0]].superAccess.slice();
        switch(event) {
          case 'NEW':
          if(!accessCopy.includes(myId) && !accessCopy.includes('all')) {
            openNotification({type: 'success', message: "New access", description: `From ${payload.pass.nickName}`})
          }
          state.friends[friendInd[0]].projects[projectInd[0]].access.push(all ? 'all' : myId);
          break

          case 'NEW_SUPER':
          if(!superAccessCopy.includes(myId) && !superAccessCopy.includes('all')) {
            openNotification({type: 'success', message: "New super access", description: `From ${payload.pass.nickName}`})
          }
          state.friends[friendInd[0]].projects[projectInd[0]].superAccess.push(all ? 'all' : myId);
          break

          case 'KICK':
          state.friends[friendInd[0]].projects[projectInd[0]].access = all
          ? accessCopy.filter(id => id !== 'all')
          : accessCopy.filter(id => id !== myId);
          let freshCopy = state.friends[friendInd[0]].projects[projectInd[0]].access;
          if(!freshCopy.includes(myId) && !freshCopy.includes('all')) {
            openNotification({type: 'warning', message: "Lose access", description: `From ${payload.pass.nickName}`})
          }
          if(state.workPerson === superId) {

          }
          break

          case 'SUPER_KICK':
          state.friends[friendInd[0]].projects[projectInd[0]].superAccess = all
          ? superAccessCopy.filter(id => id !== 'all')
          : superAccessCopy.filter(id => id !== myId);
          let freshSuperCopy = state.friends[friendInd[0]].projects[projectInd[0]].access;
          if(!freshSuperCopy.includes(myId) && !freshSuperCopy.includes('all')) {
            openNotification({type: 'warning', message: "Lose super access", description: `From ${payload.pass.nickName}`})
          } 
          if(state.workPerson === superId) {
            // принять меры которые вводят ограничения на редактирование, если 
          }
          
          break
          default:
            
        }
        state.accessV = random;
        return state
      })();
    case 'CHANGE_MASTER':
      debugger
      return (() => {
        let projectInd = [];
          mineInd(state.projects, state.workPCD.projectId, 'superId', projectInd);
          let versionInd = [];
          mineInd(state.projects[projectInd[0]].versions, state.workPCD.workVersion, 'superId', versionInd);
        
          if(payload) { // setMe
            let myNickName = state.personObj.userData.nickName
            state.projects[projectInd[0]].versions[versionInd[0]].master = myNickName;
            state.availablePayload = myNickName;
          } else { // unsetMe
            state.projects[projectInd[0]].versions[versionInd[0]].master = null;
            state.availablePayload = null;
          }
        state.workBranch.v = 'a'+random;
        return state
      })()

    case 'SET_ILLUSTRATIONS':  // этот элемент вызывается юзером на прямую.
      return (() => {
        const {newIllustration, action, sender, projectId} = payload;
        let projectInd = [];
        mineInd(state.projects, state.workPCD.projectId, 'superId', projectInd);

        let versionInd = [];
        mineInd(state.projects[projectInd[0]].versions, state.workPCD.workVersion, 'superId', versionInd);

          switch(action) {
            case 'ADD': 
            state.projects[projectInd[0]].versions[versionInd[0]].illustrations.push(newIllustration);
            break;
            case 'REMOVE': 
            state.projects[projectInd[0]].versions[versionInd[0]].illustrations = state.projects[projectInd[0]].versions[versionInd[0]].illustrations.filter(({src}) => src !== newIllustration.src);
            break
          }
          state.workBranch.v = 'i'+random;
        return state
      })()
    // case 'OPEN_PROJECT_CREATOR': 
    //   return {
    //     ...state,
    //     mainPlace: 'project'
    //   }
    // case 'OPEN_VERSIONS_EDITOR':  //openVersionsEditor
    //   return {
    //     ...state,
    //     mainPlace: 'version'
    //   }
    // case 'OPEN_PROJECT_SETUP': 
    //   return {
    //     ...state, 
    //     mainPlace: 'setup'
    //   }
    case 'ADD_VERSION':
    // допилить кода сюда и коммитнуть
    return (() => {
      // пройдись с дебагером тут
      // debugger
      // delete state.workBranch;

      //DEBAG SPACE
      let testObj = {txt: "yes", obj: {insTxt: "insTxt"}, arr: ['super']};
      let cloneFactory = FastClone.factory(testObj);
      let testObjClone = cloneFactory(testObj)
      //DEBAG SPACE

      let projectInd;
      state.projects.forEach(({superId}, i) => {
        if(state.workPCD.projectId === superId) {
          projectInd = i;
        }
      });
      let versionInd;
      state.projects[projectInd].versions.forEach(({superId}, i) => {
        if(state.workPCD.workVersion === superId) {
          versionInd = i
        }
      })
      // DATA EXAMPLE IS LAST VERSION;
      let dataExample = state.projects[projectInd].versions[versionInd].data;

      let DataFactory = FastClone.factory(dataExample);
      let dataClone = new DataFactory(dataExample);
      // debugger
      let newVersionInd = v4();
      state.projects[projectInd].versions.push({
        comment: payload.comment,
        date,
        superId: newVersionInd,
        illustrations: state.projects[projectInd].versions[versionInd].illustrations,
        data: dataClone
      });

      let PCDInd;
      state.projectsCoordsData.forEach(({projectId}, i) => {
        if(state.workPCD.projectId === projectId) {
          PCDInd = i;
        }
      });
      
      let PCDFactory = FastClone.factory(state.workPCD[state.workPCD.workVersion]);
      
      state.projectsCoordsData[PCDInd][newVersionInd] = new PCDFactory(state.workPCD[state.workPCD.workVersion]); // точечное копирование???
      state.projectsCoordsData[PCDInd].workVersion = newVersionInd;
      
      //delete state.workPCD;
      state.workPCD = state.projectsCoordsData[PCDInd];

      let newWorkBranch = state.projects[projectInd].versions[state.projects[projectInd].versions.length-1].data; 
      let path = state.workPCD[state.workPCD.workVersion].path.substring(1);
      while(path.length) {
        newWorkBranch = newWorkBranch.branch['q'+path[0]];
        path = path.substring(1);
      };

      newWorkBranch.v = 'v'+random
      return {
        ...state,
        workBranch: newWorkBranch,
        mainPlace: 'editor'
      }
    })()
    case 'SAVE_POD': //wb.v
    debugger
    return (() => {
      
      console.log('PAYLOD:', payload);
      const {data: {label, mainPart, comment, artsDesription, branchDirection, answers, artSrc}, selectedType} = payload;
      
      let realWorkBranch = state.workBranch.branch;
      let currentHeight = state.workPCD[state.workPCD.workVersion].height;

      const updatePod = () => {
        realWorkBranch.base[currentHeight] = {
          coord: {
            path: state.workBranch.pos,
            height: currentHeight
          },
          label,
          main: mainPart,
          comment,
          picture: {
            src: artSrc,
            alt: artsDesription
          }
        }
      };

      const updateAnswers = () => {
        debugger
        answers.forEach(({content, key, ref}) => {
          console.log(typeof key)
          realWorkBranch['q'+key] = {
            ans: content,
            pos: state.workBranch.pos+key,
            branch: {
              branchDirection: '',
              base: [
                {
                  coord: {
                    path: state.workBranch.pos+key,
                    height: "0"
                  },
                  label: '',
                  main: '',
                  comment: '',
                  picture: {
                    src: null,
                    alt: ''
                  }
                }
              ], // сделать красиво
              question: false,
              choseCount: 0,
              ref: ref.length === 0 ? false : ref,
              }
          }
        });
        realWorkBranch.choseCount = answers.length;
        realWorkBranch.question = {
          coord: {
            path: state.workBranch.pos,
            height: 'question'
          },
          label,
          main: mainPart,
          comment,
          picture: {
            src: artSrc,
            alt: artsDesription
          }
        };
      }
      
      // первые 3 случая более чем реальны!
      if(selectedType === "0" && currentHeight !== 'question') {
        //обновить ПОД по рабочей высоте
        updatePod()
      } else if(selectedType === "1" && currentHeight === 'question') {
        // обновить вопрос и ответы 
        updateAnswers()
      } else if(selectedType === "1" && currentHeight !== 'question') {
        updateAnswers()
        debugger
        if(currentHeight < (realWorkBranch.base.length-1)) {
          // Добавить уведомления о том, что поды были перемещены по нулевому ответу
          let zeroBase = realWorkBranch.base.splice(currentHeight+1);
          // переписать адресы подов в соответсвтующие
          realWorkBranch['q0'].branch.base = zeroBase.map((el, i) => {
            return {
              ...el,
              coord: {path: el.coord.path+"0", height: i}
            }
          });
        }
        realWorkBranch.base.splice(currentHeight, 1);
        state.workPCD[state.workPCD.workVersion].height = 'question';
        
        //обновить вопрос и ответы, а так же ликвидировать ПОД по высоте
      } else if(selectedType === "0" && currentHeight === 'question') {
        let realWorkBranch = state.workBranch.branch;
        realWorkBranch.base = [...realWorkBranch.base, {
          coord: {
            path: state.workBranch.pos,
            height: realWorkBranch.base.length
          },
          label,
          main: mainPart,
          comment,
          picture: {
            src: artSrc,
            alt: artsDesription,
          }
        }]
        state.workPCD[state.workPCD.workVersion].height = realWorkBranch.base.length-1;
        
        for(let i = 0; i < realWorkBranch.choseCount; i++) {
          delete realWorkBranch['q'+i+''];
        }
        realWorkBranch.choseCount = 0;
        realWorkBranch.question = false;
        //опасный момент. Оставлю на последок.
        //создать ПОД по максимальной высоте и ликвидировать вопрос с ответами.
      }
      state.workBranch.branch.branchDirection = branchDirection;
      state.workBranch.v = 'p'+random; // события по обработчику
      return {
        ...state
      }
    })();

    case 'CHANGE_BRANCH': //wb.v--
    // перемещения при выборе ответа на вопрос и отлетании на предыдущий вопрос
    // payload = 0
    
    return (() => {
      if(payload === 'back') {
        let path = state.workPCD[state.workPCD.workVersion].path;
        state.workPCD[state.workPCD.workVersion].path = path.substring(0, path.length-1);
        state.workPCD[state.workPCD.workVersion].height = "question";
        
        let projectInd;
        for(let i in state.projects) {
          if(state.workPCD.projectId === state.projects[i].superId) {
            projectInd = i;
          }
        };
        let versionInd;
        for(let i in state.projects[projectInd].versions) {
          if(state.workPCD.workVersion === state.projects[projectInd].versions[i].superId) {
            versionInd = i;
          }
        }
        state.workBranch = state.projects[projectInd].versions[versionInd].data;
        let workPath = state.workPCD[state.workPCD.workVersion].path.substring(1);
        while(workPath) {
          state.workBranch = state.workBranch.branch['q'+workPath[0]];
          workPath = workPath.substring(1);
        };
        if(state.workBranch.branch.base.length) {
          state.workPCD[state.workPCD.workVersion].height = '0'
        }

      } else {
        state.workBranch = state.workBranch.branch['q'+payload];
        state.workPCD[state.workPCD.workVersion].path = state.workPCD[state.workPCD.workVersion].path+payload;
        state.workPCD[state.workPCD.workVersion].height = "question";
        if(state.workBranch.branch.base.length) {
          state.workPCD[state.workPCD.workVersion].height = "0";
        }
        
      }
      
      state.workBranch.v = 'c'+random;
      return {
        ...state
      }
    })();
    case 'ADD_POD': //wb.v
    return (() => {
      
      console.log(payload)
        // создание нового элемента и переадресация процесса на него
        let realWorkBranch = state.workBranch.branch;
        if(payload !== 'question') {
          let firstPart = realWorkBranch.base.slice(0, +payload+1);
          let secondPart = realWorkBranch.base.slice(+payload+1);
          realWorkBranch.base = [...firstPart, {
            coord: {
              path: state.workBranch.pos,
              height: +payload+1
            },
            label: '',
            main: '',
            comment: '',
            picture: {
              src: null,
              alt: ''
            }
          }].concat(secondPart.map((data) => {
            const {path, height} = data.coord
            return {...data, coord: {path, height: +height+1}}
          }));
          state.workPCD[state.workPCD.workVersion].height = +payload+1;
      } else {
          realWorkBranch.base = [...realWorkBranch.base, {
            coord: {
              path: state.workBranch.pos,
              height: realWorkBranch.base.length
            },
            label: '',
            main: '',
            comment: '',
            picture: {
              src: null,
              alt: ''
            }
          }];
          state.workPCD[state.workPCD.workVersion].height = realWorkBranch.base.length-1;
        }
        
        state.workBranch.v = 'p'+random;
      return {
        ...state
      }
    })()
    case 'CHOOSE_POD': 
    return (() => {
      state.workPCD[state.workPCD.workVersion].height = payload;
      state.mainPlace = 'editor';
      state.workBranch.v = 'c'+random
      return {
        ...state
      }
    })()
    case "DELETE_POD": //wb.v
    return (() => {
      
      console.log(payload)
      let realWorkBranch = state.workBranch.branch;
      let newCurrentHeight;
      if(payload === 'question') {
        for(let i = 0; i < realWorkBranch.choseCount; i++) {
          delete realWorkBranch['q'+i]
        }
        realWorkBranch.choseCount = 0;
        realWorkBranch.question = false;
        newCurrentHeight = realWorkBranch.base.length-1;
      } else {
        realWorkBranch.base.splice(payload, 1);
        realWorkBranch.base = realWorkBranch.base.map((el, i) => ({...el, coord: {...el.coord, height: i}}))
        
        if((realWorkBranch.base.length-1) >= payload) {
          newCurrentHeight = payload;
        } else {
          newCurrentHeight = payload-1;
        }
      }
      state.workPCD[state.workPCD.workVersion].height = newCurrentHeight;
      state.workBranch.v = 'p'+random;
      return {
        ...state
      }
    })()
    case 'SELECT_PROJECT': 
    console.log(payload)
    return (() => {
      let isFriend = state.personObj.userData.friends.some(({superId}) => superId === state.workPerson);
      if(state.personObj.userData.superId !== state.workPerson) {
        //обновление координат данных о последних проектах
        if(isFriend) { 
          let workFriendInd;
          for(let i in state.personObj.userData.friends) {
            if(state.personObj.userData.friends[i].superId === state.workPerson) {
              workFriendInd = i;
            }
          };
          state.personObj.userData.friends[workFriendInd].lastProject = payload;
        }
      } else {
        state.personObj.userData.myLastProject = payload;
      };

      let PCDInd;
      state.projectsCoordsData.forEach(({projectId}, i) => {
        if(payload === projectId) {
          PCDInd = i;
        }
      });

      let projectInd;
      state.projects.forEach(({superId}, i) => {
        if(payload === superId) {
          projectInd = i;
        }
      });
      
      // Хендлинг остутсвия проекта в PCD юзера и компенсация пропуска
      if(PCDInd === undefined) { // работает при пике проекта у друга
        // add new project in PCD;
        let firstVersionId = state.projects[projectInd].versions[0].superId;
        let workHeight = state.projects[projectInd].versions[0].data.branch.base.length ? "0" : "question";
        state.projectsCoordsData.push({projectId: payload, workVersion: firstVersionId, [firstVersionId]: {path: "0", height: workHeight}})
        PCDInd = state.projectsCoordsData.length-1;
      }

      state.workPCD = state.projectsCoordsData[PCDInd]; 
      let versionInd;
      for(let i in state.projects[projectInd].versions) { //lastProject
        if(state.projects[projectInd].versions[i].superId === state.workPCD.workVersion) {
          versionInd = i;
        }
      };
      state.workBranch = state.projects[projectInd].versions[versionInd].data;
  
      let workPath = state.workPCD[state.workPCD.workVersion].path.substring(1);
      while (workPath.length) {
        state.workBranch = state.workBranch.branch['q'+workPath[0]];
        workPath = workPath.substring(1);
      };
      state.workBranch.v = 'c'+random;
      state.mainPlace = 'editor';
      return {
        ...state,
      }
    })()
    case 'SELECT_VERSION': 
    return (() => {
      console.log('payload');
      state.workPCD.workVersion = payload;

      let projectInd = [];
      mineInd(state.projects, state.workPCD.projectId, 'superId', projectInd);

      let versionInd = [];
      mineInd(state.projects[projectInd[0]].versions, payload, 'superId', versionInd);
      
      state.workBranch = state.projects[projectInd[0]].versions[versionInd[0]].data;
      let path = state.workPCD[payload].path.substring(1);
      pathReducer(path, state)
      state.workBranch.v = 'c'+random
      return state
    })();
    case 'PREVIEW_PERSON': 
    return (() => {
      // ОЧЕНЬ ПЛОХАЯ ИДЕЯ... ОЧЕНЬ.. без... И все таки это улетает на ребилд после альфы.
      // 
      console.log("PREVIEW_PERSON: ", payload) 
         // payload = {userData, projects, }
      const {projects, userData} = payload;
      state.projects = projects;
      state.workPerson = userData.superId;
      state.workBranch = projects[0].versions[0].data;

      //let versionId = projects[0].versions[0].superId;
      // projects.reverse().forEach(({superId, versions: {superId: versionId}}) => {
      //   state.projectsCoordsData.push({projectId: superId, workVersion, }) // это должно быть частью SELECT PROJECT
      // }) // дополнение PCD при отсутстивии пакета с Id выбранного проекта
      // state.workPCD = {
      //   projectId: projects[0].superId, 
      //   workVersion: versionId,
      //   [versionId]: {path: "0", height: "0"}
      // };
      //state.projectsCoordsData.push(state.workPCD);
   
      return state
    })()
    case 'ADD_FRIEND': 
      //payload === user 
      debugger
      console.log(payload)
      return (() => {
        const {userData} = payload
        state.personObj.userData.friends.push({superId: userData.superId, lastProject: null});
        state.friends.push(payload);
        return state
      })()
    case 'CHOOSE_ME': 
      return (() => {
        // вызов с вынужденной датой через перепресваивание рабочего проекта
        // грядет эпоха геттеров 
        state.workBranch = {};
        state.projects = state.personObj.projects;
        state.workPerson = state.personObj.userData.superId;

        if(state.personObj.userData.myLastProject !== null) {
          const lastProject = state.personObj.userData.myLastProject;
          
          let projectsCoordInd = [];
          mineInd(state.projectsCoordsData, lastProject, 'projectId', projectsCoordInd)
   
          state.workPCD = state.projectsCoordsData[projectsCoordInd[0]];
          let projectInd = []
          mineInd(state.projects, state.workPCD.projectId, 'superId', projectInd)

          let versionInd = [];
          mineInd(state.projects[projectInd[0]].versions, state.workPCD.workVersion, 'superId', versionInd)
    
          state.workBranch = state.projects[projectInd[0]].versions[versionInd[0]].data;
          let path = state.workPCD[state.workPCD.workVersion].path.substring(1);
          pathReducer(path, state);
          state.mainPlace = 'editor';
        } else {
          state.workPCD = null
          state.workBranch.branch = {};
          state.mainPlace = 'beginner'
        }
      state.workBranch.v = 'c'+random
        return state;
      })()
    case 'CHOOSE_PERSON':
  
      // будут ли происходить изменения в друзьях при модифировании 
      return (() => {
        //payload === superId [friend]
        // ОБРАБОТАТЬ ВСЕ ИСКЛЮЧЕНИЯ...
        debugger
        let friendInd = [];
        mineInd(state.friends, payload, ['userData', 'superId'], friendInd);

        state.projects = state.friends[friendInd[0]].projects;

        let deepFriendInd = [];
        mineInd(state.personObj.userData.friends, payload, 'superId', deepFriendInd);
        // friends last project....
        let lastMyProjectInFriend = state.personObj.userData.friends[deepFriendInd[0]].lastProject;
        if(lastMyProjectInFriend !== null) {
          // чекнуть исключения на удаленный проект
          let PCDInd = [];
          mineInd(state.projectsCoordsData, lastMyProjectInFriend, 'projectId', PCDInd);

          state.workPCD = state.projectsCoordsData[PCDInd[0]];

          let projectInd = [];
          mineInd(state.projects, state.workPCD.projectId, 'superId', projectInd)

          console.time()
          let versionInd = [];
          mineInd(state.projects[projectInd[0]].versions, state.workPCD.workVersion, 'superId', versionInd)
          console.timeEnd()
          state.workBranch = state.projects[projectInd[0]].versions[versionInd[0]].data;
          let path = state.workPCD[state.workPCD.workVersion].path.substring(1);
          pathReducer(path, state)
          state.mainPlace = 'editor'
        } else {
          state.workPCD = null;
          state.workBranch.branch = {};
          state.mainPlace = 'choose'
        }
        state.workPerson = payload;
        state.workBranch.v = 'c'+random;
        return {
          ...state
        }
      })()
    case 'INIT':
      debugger
      return (() => {
        // РЕВОРК ! (пробелема с пустыми данными...)
        // РЕФАКТОРИИИНГ  !!!!! !! ! (хотя бы до первого деплоя)
        console.log('%c%s', 'color: pink; font-size: 22px', "DEBUG:", payload)
        const {friends, personObj: {projects, projectsCoordsData, lastProject, lastPerson, userData: {superId}}} = payload;
        state.personObj = payload.personObj
        //state.projects = projects;
        state.projectsCoordsData = state.personObj.projectsCoordsData;
        state.friends = friends
        // Всегда можно найти себя по этому адресу..
        //state.currentProject = lastProject;
        state.workBranch = {};
      
        let projectsCoordInd = null;
          for(let x=0;x<projectsCoordsData.length;x++) {
            if(projectsCoordsData[x].projectId === lastProject) {
              projectsCoordInd = x;
            }
          }

        if(lastPerson === superId) {
          ///
          state.projects = state.personObj.projects
          ///
          let lockInd = null;
          for(let i=0;i<projects.length;i++) {
            if(projects[i].superId === lastProject) {
              lockInd = i;
            }
          }
          if(projectsCoordInd !== null) {
            // Уже есть проект 
            let pcd = projectsCoordsData[projectsCoordInd];
            let version = pcd.workVersion;
            let {path, height} = pcd[version];

            let versionInd;
            for(let i in state.projects[lockInd].versions) {
              if(version === state.projects[lockInd].versions[i].superId) {
                versionInd = i;
              }
            }

            state.workBranch = state.projects[lockInd].versions[versionInd].data;

            path = path.substring(1);
            while(path.length) {
              state.workBranch = state.workBranch.branch['q'+path[0]];
              path = path.substring(1);
            }
            state.workPCD = state.projectsCoordsData[projectsCoordInd];
            //state.workVersion = workVersion;
            state.workPerson = superId;
            //state.currentHeight = height;
          } else {
            // еще нет проектов 
            state.workPCD = null
            state.workBranch.branch = {};
            state.workPerson = superId;
            state.mainPlace = 'beginner'
          }
        } else {
          debugger
          // обработать ошибку с отключенным аксессом и в следствии этого упавшим проектом

          // поиск проекта и метаданных у другого персонажа
          // можно добавлять в друзья, если есть хотя бы один проект
          // ДОДЕЛАТЬ С ДЕБАГЕРОМ...

          // ЧТО ЕСЛИ У ЧЕЛА НЕТ ПРОЕКТОВ????
          // ЗАСЕЙВИТЬ ГДЕ ТО данные персон обjecta;;
          // все норм, только нужно хендлить пустые проекты 
          state.workPerson = lastPerson; // прокинут ийди человечка

          let friendInd = null;
          friends.forEach(({userData: {superId}}, i) => {
            if(lastPerson === superId) {
              friendInd = i;
            }
          })
          state.projects = state.friends[friendInd].projects; /// прокинуты проекты

          if(lastProject !== null) { // ЕСть с чем работать.
            let projectInd;
            state.projects.forEach(({superId}, i) => {
              if(lastProject === superId) {
                projectInd = i;
              }
            })
            
            // let PCDInd;
            // state.projectsCoordData.forEach(({projectId}, i) => {
            //   if(lastProject === projectId) {
            //     PCDInd = i;
            //   }
            // });

            state.workPCD = state.projectsCoordsData[projectsCoordInd]; // прокинуты workPCD

            let versionInd;
            state.projects[projectInd].versions.forEach(({superId}, i) => {
              if(superId === state.workPCD.workVersion) {
                versionInd = i;
              }
            })
            
            state.workBranch = state.projects[projectInd].versions[versionInd].data  // прокинут ворк бренч.
            let path = state.workPCD[state.workPCD.workVersion].path.substring(1);

            while(path.length) {
              state.workBranch = state.workBranch.branch['q'+path[0]];
              path = path.substring(1);
            }
          } else {
            state.workPCD = null;
            state.workBranch.branch = {};
            state.mainPlace = 'choose'
          }

          
          
          // for(let k=0;k<friends.length;k++) {
          //   if(friends[k])
          // }
        }
        state.workBranch.v = Math.random();
        return {
          ...state
        }
      })()
    default:
      return state;
  }
  
  // function mineInd(source, etalon, key, mod) {
  //   for(let i in source) {
  //     const natSource = i => {
  //         key = Array.isArray(key) ? key : [key]
  //         let base = source[i];
  //         let keyPath = key.slice();
  //         while(keyPath.length) {
  //           base = base[keyPath.shift()];
  //         }
  //         return base;
  //     }
  //     if(natSource(i) === etalon) {
  //       mod[0] = i
  //     }
  //   }
  // };
  function pathReducer(path, state) {
    while(path.length) {
      state.workBranch = state.workBranch.branch['q'+path[0]];
      path = path.substring(1);
    };
  };
}