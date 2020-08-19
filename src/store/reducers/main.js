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

// Эффектная логика (обновление PCD( внутри person также), проектов, новые версии, проекты
// setup(access), а также состояние мастера) просходит за счет накидывания приставок к workVersion.v
// Новые версии отлавливаются и фильтруются, с последующими вызовами сокет эвентов.
// Они же отлавливаются уже на сервере и там проиходит обновленние данных юзера уже в users.json. Много эвентов
// производят обратный вызов, которые отлавливаются всеми кто в комнате. (нами тоже(филтрятся через sender))
// 

import {format} from 'date-fns';
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
  ways: [{wayId: 'uuv4maybe', wayDirection: 'Way to the other side of the river', color: 'black'}],
  data: {
    pos: "0",
    wayId: 'uuv4maybe',
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
  // currentVersion: 0, // Кибер прах, помянем
  // currentHeight: 0,
  // workProject: 0,
  mapStore: [],
  mapGrid: [],  //Мап ресы
  mapCurrent: '',
  availablePayload: null,
  users: [], // all exist users
  personObj: null, // Всегда можно найти себя по этому адресу..
  friends: [],
  mainPlace: 'editor', // project save
}
let date = format(new Date(), "yyyy-MM-dd"); 
export default (state = defState, action) => {
  const {type, payload, random} = action;
  // function updatPersonObj() {
  //   if(state.workPerson === state.personObj.userData.superId) {
  //     state.personObj.projects = state.projects;
  //     state.personObj.projectsCoordsData = state.projectsCoordsData;
  //   }
  // }
  // Псевдо мидл
  if(type !== 'CHANGE_BRANCH') { // DESTROY DIRTY MAP FIELDS, BECAUSE WE NEED FRESH
    /// сделать сравние более лояльным может даже функцию с свичем замутить.
    state.mapStore = [];
    state.mapGrid = [];
    state.mapCurrent = [];
  }

  (() => {
    //const StateFactory = FastClone.factory(state);
    if(!Array.isArray(window.reduxHistory)) {
      window.reduxHistory = []
    }
    window.reduxHistory.push({
      //state: new StateFactory(state), Он просто критически капризный 
      // картина будет восстанавливаться по Тайпам и пейлоадам...
      type,
      payload,
    })
  })()

  function returnError () {
    state.workBranch = {};
    state.workPCD = null; //При нулеке появляется баг с обновлением даты, о того юзера, 
    // который кикнул
    // c друго стороны есть праверка на PCD много где.
    // Окей, предположим, что новых показателем качества рабочего процесса будет 
    // существование workBranch.branch.base
    // на ребилде разделить перменные на те, что отвечате за редер и те, что отвечают 
    // за работу с данными.
    state.workBranch.branch = {};
    state.mainPlace = 'error';
    state.workBranch.v = random;
  }

  function checkBottomData (successMove) {
    if(state.workPCD[state.workPCD.workVersion].height === 'question') {
      // Check exist question
      if(state.workBranch.branch.question) {
        successMove()
        //state.mainPlace = 'editor'
      } else {
        returnError();
      } 
    } else {
      // Check exist pod...
      if(state.workBranch.branch.base?.[state.workPCD[state.workPCD.workVersion].height] ?? false) {
        successMove()
        //state.mainPlace = 'editor'
      } else {
        returnError();
      }
    }
  }

  switch(type) {
  
    // И как интегрировать мидл???
    case 'ADD_PROJECT': //wb.v
    //disavaible middleware модификация pcd..

      return (() => {

        const wayId = v4(),
        versionId = 'v'+v4(),
        projectId = 'p'+v4(),
        {name, description, access, superAccess} = payload;
        state.projects.unshift({
          name,  
          description,
          superId: projectId, 
          access,
          superAccess,
          versions: [{
          comment: 'Init',
          date,
          superId: versionId,
          master: null,
          illustrations: [],
          ways: [{wayId, color: 'green', wayDirection: ''}],
          data: {
            pos: "0",
            wayId,
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
      
      return (() => {
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

    case 'LOGOUT': 
      return (() => {
        delete localStorage.token;
        return {
          projectsCoordsData: [],
          projects: false,
          workPerson: null,
          workPCD: null,
          workBranch: null,
          mapStore: [],
          mapGrid: [],  //Мап ресы
          mapCurrent: '',
          availablePayload: null,
          users: [], // all exist users
          personObj: null, // Всегда можно найти себя по этому адресу..
          friends: [],
          mainPlace: 'editor', // project save
        }
      })()
    case 'OPEN_PLACE': 
      return {
        ...state,
        mainPlace: payload
      }
    case 'CLEAN_APPLICANT_LIST':
      return (() => {
      
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
        // рефакторни это место. поиски можно вынести наверх
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
          case 'new_version': 
            connected && (() => {
              const {projectId, workVersion} = data;

              let projectInd = [];
              mineInd(state.projects, projectId, 'superId', projectInd);
              state.projects[projectInd[0]].versions.push(workVersion);
              state.workBranch.v = random;
            })()
          break
          case 'versions':
            connected && (() => {

              // нужно чекать есть что рендерить, или нужно дропать ошибку тут.

              let {person, projectId, versionId, workVersion} = data;
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
              state.workBranch.v = random;
              pathReducer(path, state);

              // Проверка на то, что в новой дате, есть данные, с координатами, работающего PCD 
              // Если нет, то выбрасывается ошибка, хотя можно сделать куда мягче, но это уже на rebuild 
              

              let pcdInd = [];
              mineInd(state.projectsCoordsData, state.workPCD.projectId, 'proojectId', pcdInd);
              
              if(state.workBranch !== 'None') {
           
                localStorage.updateWithDeleteWorkDirFlag = 'false'
                checkBottomData(() => {localStorage.updateWithDeleteWorkDirFlag = 'true'}); //SUCCESS MOVE not fail

                // с такой явной анигирующей логикой нужно слушать проекты, а не юзера
                // а еще нужно разделить обязанности рабочих групп. из за этого система не гибкая

                if(localStorage.updateWithDeleteWorkDirFlag !== 'true') {
                  state.projectsCoordsData.splice(pcdInd[0], 1);
                  state.lastProject = null;
                  state.workBranch.v = 'c'+random;
                }
              } else {
                returnError()
                state.projectsCoordsData.splice(pcdInd[0], 1);
                state.lastProject = null;
                state.workBranch.v = 'c'+random;
              } 

              
            })()
          break;
          case 'available': 
          connected && (() => {
            // ПРодумай как фильтрить это..
            let {workPCD, pass} = data; // Хаю хай тут баг, кста, когда чел будет в комнате выбора, 
            // он может получить этот вызов и ничего не обновить... Безотказная система падет.
            // можно обходить это простой проверкой на рабочего чела, который добывается в персоне сверху
            let projectInd = [];
            mineInd(state.projects, workPCD.projectId, 'superId', projectInd);
    
            let versionInd = [];
            mineInd(state.projects[projectInd[0]].versions, workPCD.workVersion, 'superId', versionInd);
            if(state.projects[projectInd[0]].versions[versionInd[0]].master !== state.personObj.userData.nickName) {
              state.projects[projectInd[0]].versions[versionInd[0]].master = pass;
            }
           
            
            
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
          case 'delete': 
          connected && (() => {
            
            const {workPCD, target} = data;
            let projectInd = [];
            mineInd(state.projects, workPCD.projectId, 'superId', projectInd);

            let PCDInd = [];
            mineInd(state.projectsCoordsData, workPCD.projectId, 'projectId', PCDInd);
            if(target === 'project') {
              state.projects.splice(projectInd[0], 1);
              state.projectsCoordsData.splice(PCDInd[0], 1);

            } else {
              // в будущем отловить исключение и сделать подхват существующих версий. 
              // А если удаляется последняяя версия, то удаляется проект. Это чекается в рекдакторе версии
              // проще всего полностью снести PCD. потом просто репикнуть. С мапой это на изи делается.
              
              let versionInd = [];
              mineInd(state.projects[projectInd[0]].versions, workPCD.workVersion, 'superId', versionInd);
              state.projects[projectInd[0]].versions.splice(versionInd[0], 1);
              state.projectsCoordsData.splice(PCDInd[0], 1);
              // прочекать подъем проекта и версий в PCD.
            }

            // перебрасывать и удаялять PCD если рабочий проект тот же
            // иначе все остается на месте, просто появится пушка об удалении

            if(state.workPCD.projectId === workPCD.projectId) {
              state.workBranch = {}; // модификафии адресованы к .branch. хотя, что?
              state.workBranch.branch = {};
              state.workPCD = null;
              state.mainPlace = 'error';
            }
            state.workBranch.v = random
          })()
          break
          default:
        }
        return state;
      })();
    case 'ACCESS_CONTROL': 
      //{event, pass} = payload
      //{projectId, superId} = pass 
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
            // нужно убивать PCD и выдываать ошибку, если чел state.workPCD.projectId === projectId
            // Все подъемы не видят access пробемы. Значит нужно расправляется с PCD здесь
            if(state.workPCD.projectId === projectId) {
              let pcdInd = [];
              mineInd(state.projectsCoordsData, projectId, 'projectId', pcdInd);
              state.projectsCoordsData.splice(pcdInd[0], 1);
              returnError();
              
              state.workBranch.v = 'c'+random;
            }
            
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
            // меры применяется автоматически, на основе встроенных фильтров superAccess
          }
          
          break
          default:
            
        }
        state.accessV = random;
        return state
      })();
    case 'NEW_FRIEND_PROJECT': // DISP LOGIN, guest side
      return (() => {
        const {personId, project} = payload;
        let friendInd = [];
        mineInd(state.friends, personId, ['userData', 'superId'], friendInd);
        state.friends[friendInd[0]].projects.push(project);
        state.friendV = random;
        state.workBranch.v = random;
        return state;
      })()
    case 'CHANGE_MASTER':
      return state.workPCD
      ? (() => {
        let projectInd = [];
          mineInd(state.projects, state.workPCD.projectId, 'superId', projectInd);
          let versionInd = [];
          mineInd(state.projects[projectInd[0]].versions, state.workPCD.workVersion, 'superId', versionInd);
        
          if(payload) { // setMe
            let myNickName = state.personObj.userData.nickName
            state.projects[projectInd[0]].versions[versionInd[0]].master = myNickName;
            state.availablePayload = myNickName;
            state.workBranch.v = 'a'+random;
          } else { // unsetMe
            if(state.projects[projectInd[0]].versions[versionInd[0]].master === state.personObj.userData.nickName) {
              state.projects[projectInd[0]].versions[versionInd[0]].master = null;
              state.availablePayload = null;
              state.workBranch.v = 'a'+random;
            }
            
            
          }
        
        return state
      })()
      : state

    case 'SET_ILLUSTRATIONS':  // этот элемент вызывается юзером на прямую.
      return (() => {
        const {newIllustration, action} = payload;
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
      case 'SET_MAP_DATA':
        return (() => {
          const {mapGrid, mapStore, mapCurrent} = payload;
          return {
            ...state, mapGrid, mapStore, mapCurrent
          };
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
      // let testObj = {txt: "yes", obj: {insTxt: "insTxt"}, arr: ['super']};
      // let cloneFactory = FastClone.factory(testObj);
      // let testObjClone = cloneFactory(testObj)
      //DEBAG SPACE

      let projectInd = [];
      mineInd(state.projects, state.workPCD.projectId, 'superId', projectInd)

      let versionInd = [];
      mineInd(state.projects[projectInd[0]].versions, state.workPCD.workVersion, 'superId', versionInd)
      // DATA EXAMPLE IS LAST VERSION;
      let dataExample = state.projects[projectInd[0]].versions[versionInd[0]].data;

      let DataFactory = FastClone.factory(dataExample);
      let dataClone = new DataFactory(dataExample);
      // debugger
      const {illustrations} = state.projects[projectInd[0]].versions[versionInd[0]];

      let newVersionInd = 'v'+v4();
      state.projects[projectInd[0]].versions.push({
        comment: payload.comment,
        date,
        superId: newVersionInd,
        master: null,
        //ways,
        illustrations,
        data: dataClone
      });

      let PCDInd = [];
      mineInd(state.projectsCoordsData, state.workPCD.projectId, 'projectId', PCDInd);
      
      let PCDFactory = FastClone.factory(state.workPCD[state.workPCD.workVersion]);
      
      state.projectsCoordsData[PCDInd[0]][newVersionInd] = new PCDFactory(state.workPCD[state.workPCD.workVersion]); // точечное копирование???
      state.projectsCoordsData[PCDInd[0]].workVersion = newVersionInd;
      
      //delete state.workPCD;
      state.workPCD = state.projectsCoordsData[PCDInd[0]];

      state.workBranch = state.projects[projectInd[0]].versions[state.projects[projectInd[0]].versions.length-1].data; 
      let path = state.workPCD[state.workPCD.workVersion].path.substring(1);
      pathReducer(path, state);

      state.workBranch.v = 'v'+random;
      state.mainPlace = 'editor';
      return state
    })()
    case 'NEW_FRIEND_VERSION':
      return (() => {

        return state
      })()
    case 'SAVE_POD': //wb.v

    return (() => {
      // Доделать этот компонент.
      // Интегрировать новую дату: PathDirection на уровне версии, потом пройтись по всему и прокомментить
      const {data: {label, mainPart, comment, artsDesription, branchDirection, wayDirection, answers, artSrc}, selectedType} = payload;
      
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

      // здесь происходит модифицирование описания рабочего вея не зависимо вопрос это или под

      // let etalonWay = state.workBranch.wayId;
      // let projectInd = [];
      // mineInd(state.projects, state.workPCD.projectId, 'superId', projectInd)

      // let versionInd = [];
      // mineInd(state.projects[projectInd[0]].versions, state.workPCD.workVersion, 'superId', versionInd)

      // let etalonWayInd = [];
      // mineInd(state.projects[projectInd[0]].versions[versionInd[0]].ways, etalonWay, 'wayId', etalonWayInd);

      // state.projects[projectInd[0]].versions[versionInd[0]].ways[etalonWayInd[0]].wayDirection = wayDirection;

      const updateAnswers = () => {
        answers.forEach(({content, key, ref}) => { // wayColor, wayId
          console.log(typeof key);

          //!!! пройдись с дебаггером. Но все должно быть хорошо. Нельзя просто так переставлять элементы.
          // -> последовательность сохранится

          const isNewBranch = !realWorkBranch.hasOwnProperty('q'+key);
          realWorkBranch['q'+key] = isNewBranch
          ? {
            ans: content,
            pos: state.workBranch.pos+key,
            //wayId,
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
          : {...realWorkBranch['q'+key], ans: content} // wayId
          // if(isNewBranch) {
          //   state.projects[projectInd[0]].versions[versionInd[0]].ways.push({wayId, color: wayColor, wayDirection: ''})
          // } else {   
          //   // find and modif   
          //   let wayInd = [];
          //   mineInd(state.projects[projectInd[0]].versions[versionInd[0]].ways, wayId, 'wayId', wayInd);
          //   if(etalonWay === state.projects[projectInd[0]].versions[versionInd[0]].ways[wayInd[0]].wayId) {
          //     state.projects[projectInd[0]].versions[versionInd[0]].ways[wayInd[0]] = {wayId, color: wayColor, wayDirection}
          //   } else {
          //     state.projects[projectInd[0]].versions[versionInd[0]].ways[wayInd[0]] = {
          //       ...state.projects[projectInd[0]].versions[versionInd[0]].ways[wayInd[0]], color: wayColor
          //     }
          //   }
          // };
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
      
      // где то здесь получается...
      state.workBranch.v = 'p'+random; // события по обработчику
      return {
        ...state
      }
    })();

    case 'CHANGE_BRANCH': //wb.v--
    // перемещения при выборе ответа на вопрос и отлетании на предыдущий вопрос
    // payload = 0
    
    return (() => {
      let projectInd = [];
      mineInd(state.projects, state.workPCD.projectId, 'superId', projectInd)

      let versionInd = [];
      mineInd(state.projects[projectInd[0]].versions, state.workPCD.workVersion, 'superId', versionInd)
      
      if(payload === 'back') { // возвращение на ласт вопрос
        let path = state.workPCD[state.workPCD.workVersion].path;
        state.workPCD[state.workPCD.workVersion].path = path.substring(0, path.length-1);
        state.workPCD[state.workPCD.workVersion].height = "question";
        
        
        state.workBranch = state.projects[projectInd[0]].versions[versionInd[0]].data;
        let workPath = state.workPCD[state.workPCD.workVersion].path.substring(1);
        pathReducer(workPath, state);
        // while(workPath) {
        //   state.workBranch = state.workBranch.branch['q'+workPath[0]];
        //   workPath = workPath.substring(1);
        // };
        if(state.workBranch.branch.base.length) {
          state.workPCD[state.workPCD.workVersion].height = '0'
        }

      } else if(typeof payload === 'string') { // Event from map

        state.workBranch = state.projects[projectInd[0]].versions[versionInd[0]].data;
        state.workPCD[state.workPCD.workVersion].path = payload;
        state.workPCD[state.workPCD.workVersion].height = "question";
        let path = payload.substring(1);
        pathReducer(path, state);

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
    return (() => {

      // Это не просто точка входа в проект, это МЕД БРИГАДА, которая уничтожает вредоносный PCD и делает новый, причем 
      // Отлавливаются проблемы на всех уровнях.. с последующей перезаписью через приставку.

      // этот блок отвечает за то, что бы сейвить myLastProject, которые используется для возвращения домой
      // и как альтернатива работе дом, так же сейвиться последний проект у друга... для восстановления 
      // ласт состояния у друга, после всех проверок..

      let isFriend = state.personObj.userData.friends.some(({superId}) => superId === state.workPerson);
      if(state.personObj.userData.superId !== state.workPerson) { 

        //обновление координат данных о последних проектах
        // компонент сделан так убого, потому что я пытался добывать данные у случайных челов,
        // что привело бы к бессконечноному нарастанию исключений, вокруг того пика.

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

      // Ошибка не добитого PCD это норма, искать его на сервере можно, но лучше здесь
      // Это и защита от других возможно еще не известных ошибок.

      let PCDInd = [];
      mineInd(state.projectsCoordsData, payload, 'projectId', PCDInd);

      let projectInd = [];  // двухсторонная связь, данные 100% существуют.
      mineInd(state.projects, payload, 'superId', projectInd)
      
      // Хендлинг остутсвия проекта в PCD юзера и компенсация пропуска.
      // Работает как у гостя, так и у юзера.

      function restartData() {
        let firstVersionId = state.projects[projectInd[0]].versions[0].superId;
        let workHeight = state.projects[projectInd[0]].versions[0].data.branch.base.length ? "0" : "question";
        state.projectsCoordsData.push({projectId: payload, workVersion: firstVersionId, [firstVersionId]: {path: "0", height: workHeight}})
        PCDInd = [state.projectsCoordsData.length-1];
      }

      if(!PCDInd.length) { // работает при пике проекта у друга и себя, если был делет
        // add new project in PCD;
        restartData()
      }

      state.workPCD = state.projectsCoordsData[PCDInd[0]]; 

      /// нужно отловить ошибку и выдать первичную дату ---> вынести в функцию обработчик исключений

      let versionInd = [];
      mineInd(state.projects[projectInd[0]].versions, state.workPCD.workVersion, 'superId', versionInd);
      
      if(!versionInd.length) {
        // найти wrong pcd и уничтожить
        let wPCDInd = [];
        mineInd(state.projectsCoordsData, payload, 'projectId', wPCDInd);
        state.projectsCoordsData.splice(wPCDInd[0], 1);
        restartData()
        versionInd = ['0'];
        state.workPCD = state.projectsCoordsData[PCDInd[0]]; 
      } 
      state.workBranch = state.projects[projectInd[0]].versions[versionInd[0]].data;
      
      // нужно добавить проверку на существование рабочей высоты и пода.. ибо данные в PCD могли устареть
      // в том смысле, что этих высот и путей уже нет.

      let path = state.workPCD[state.workPCD.workVersion].path.substring(1)
      pathReducer(path, state);

      if(state.workBranch !== 'None') {

        localStorage.chooseProjectFlag = 'false'
        checkBottomData(() => {localStorage.chooseProjectFlag = 'true'});

        if(localStorage.chooseProjectFlag !== 'true') {
          state.projectsCoordsData.splice(PCDInd[0], 1);
          restartData();
          state.workPCD = state.projectsCoordsData[PCDInd[0]];
            // чекнуть последствия таких включений 
          //state.workBranch.branch = state.projects[projectInd[0]].versions[versionInd[0]].data.branch;
        }
      } else {
        state.projectsCoordsData.splice(PCDInd[0], 1);
        restartData();
        state.workPCD = state.projectsCoordsData[PCDInd[0]];
         // чекнуть последствия таких включений 
        //state.workBranch.branch = state.projects[projectInd[0]].versions[versionInd[0]].data.branch;
      } 
      state.workBranch = state.projects[projectInd[0]].versions[versionInd[0]].data;
      state.workBranch.v = 'c'+random;
      state.mainPlace = 'editor';
      return {
        ...state,
      }
    })()
    case 'SELECT_VERSION': 

    return (() => {
      //payload  -> pcd.workVersion
      let projectInd = [];
      mineInd(state.projects, state.workPCD.projectId, 'superId', projectInd);

      let versionInd = [];
      mineInd(state.projects[projectInd[0]].versions, payload, 'superId', versionInd);

      if(!state.workPCD.hasOwnProperty(payload)) { 
        // пришел чел с другого акка, он не был при создании версии.. или user после delete
        const height = state.projects[projectInd[0]].versions[versionInd[0]].data.branch.base.length ? '0' : 'question';
        state.workPCD[payload] = {path: '0', height}
      } 

      // check wron

      state.workPCD.workVersion = payload;
      
      state.workBranch = state.projects[projectInd[0]].versions[versionInd[0]].data;

      state.workBranch.v = 'c'+random
      return state;
    })();
    // case 'PREVIEW_PERSON': 
    // return (() => {
    //   // ОЧЕНЬ ПЛОХАЯ ИДЕЯ... ОЧЕНЬ.. без... И все таки это улетает на ребилд после альфы.

    //   console.log("PREVIEW_PERSON: ", payload) 
    //      // payload = {userData, projects, }
    //   const {projects, userData} = payload;
    //   state.projects = projects;
    //   state.workPerson = userData.superId;
    //   state.workBranch = projects[0].versions[0].data;

    //   //let versionId = projects[0].versions[0].superId;
    //   // projects.reverse().forEach(({superId, versions: {superId: versionId}}) => {
    //   //   state.projectsCoordsData.push({projectId: superId, workVersion, }) // это должно быть частью SELECT PROJECT
    //   // }) // дополнение PCD при отсутстивии пакета с Id выбранного проекта
    //   // state.workPCD = {
    //   //   projectId: projects[0].superId, 
    //   //   workVersion: versionId,
    //   //   [versionId]: {path: "0", height: "0"}
    //   // };
    //   //state.projectsCoordsData.push(state.workPCD);
   
    //   return state
    // })()
    case 'ADD_FRIEND': 
      //payload === user 
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

        // ф находит последнюй проект, который хранится в state.personObj.userData.myLastProject
        // и если он существует, пытается найти его PCD и его самого. В случае, если все данные на месте
        // создает workBranch и перебрасывает на editor 
        // Если же он не может найти что то по координатным данным, или если этих самых PCD нет
        // То он зануляет все важны рычаги (workPCD и workBranch) и выбрасывает на нейтрольное месте.
        // Откуда можно выбрать другой проект или создать новый.
        // Алгорит описана в INIT

        state.workBranch = {};
        state.projects = payload;
        state.workPerson = state.personObj.userData.superId;

        if(state.personObj.userData.myLastProject !== null) {
          const lastProject = state.personObj.userData.myLastProject;

          let projectsCoordInd = [];
          mineInd(state.projectsCoordsData, lastProject, 'projectId', projectsCoordInd)

          if(projectsCoordInd.length) { 
            // PCD существует, значит проверка. ПРОСТО 2 ПРОВЕРКИ потом сделаю исключения более лаконичными.

            state.workPCD = state.projectsCoordsData[projectsCoordInd[0]];
            let projectInd = []
            mineInd(state.projects, state.workPCD.projectId, 'superId', projectInd)

            if(projectInd.length) {
              let versionInd = [];
              mineInd(state.projects[projectInd[0]].versions, state.workPCD.workVersion, 'superId', versionInd)
        
              if(versionInd.length) {
                state.workBranch = state.projects[projectInd[0]].versions[versionInd[0]].data;
                let path = state.workPCD[state.workPCD.workVersion].path.substring(1);
                pathReducer(path, state);

                if(state.workBranch !== 'None') {

                  // CHECK POD || QUERY проверка комплексная.. 
                  ///// надо вынести это в отдельную функцию....
                  checkBottomData(() => state.mainPlace = 'editor');
                  /////
                  
                } else {
                  returnError()
                }

              } else { 
                returnError()
              }

            } else {
              returnError()
            }

          } else {
            returnError()
          }
          
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
        
        // по сути работы ф похожа на chooseMe, так что все подробное объяснение там.
        // Возможно функции будут слиты в одну.
        // Алгорит описана в INIT
        let friendInd = [];
        mineInd(state.friends, payload, ['userData', 'superId'], friendInd);

        state.projects = state.friends[friendInd[0]].projects;

        let deepFriendInd = [];
        mineInd(state.personObj.userData.friends, payload, 'superId', deepFriendInd);
        // friends last project....
        let lastMyProjectInFriend = state.personObj.userData.friends[deepFriendInd[0]].lastProject;

        if(lastMyProjectInFriend !== null) {
          // поиск рабочего PCD, который отвечает за последний последний проект, версию, высотку пода.
          let PCDInd = [];
          mineInd(state.projectsCoordsData, lastMyProjectInFriend, 'projectId', PCDInd);
          
          if(PCDInd.length) {

            state.workPCD = state.projectsCoordsData[PCDInd[0]];
            let projectInd = [];
            mineInd(state.projects, state.workPCD.projectId, 'superId', projectInd)
            
            if(projectInd.length) {

              console.time()
              let versionInd = [];
              mineInd(state.projects[projectInd[0]].versions, state.workPCD.workVersion, 'superId', versionInd)
              
              if(versionInd.length) {

                console.timeEnd()
                state.workBranch = state.projects[projectInd[0]].versions[versionInd[0]].data;
                let path = state.workPCD[state.workPCD.workVersion].path.substring(1);
                pathReducer(path, state)

                if(state.workBranch !== 'None') {

                  // CHECK POD || QUERY проверка комплексная.. 
                  checkBottomData(() => state.mainPlace = 'editor');
                } else {
                  returnError()
                }

              } else {
                returnError()
              }
              
            } else {
              returnError()
            }
            
          } else {
            returnError()
          }
          
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
      return (() => {
        // Прокоментить каждое действие и интегрировать mineInd

        // Важнейший элемент в работе приложения. 
        // Отвечает за формирование нормального рабочего состояния, на основе данных в payload
        // Алгоритм: 1. Прокидывает основные данные (даже если они пустые)
        // 2. Определяет рабочий PCD на основе последнего проекта. -> Если нет проекта, вернет [],
        // Который отловится дальше и выбросит исключение.
        // 3. Определяет был ли юзер в другом профиле или у себя на момент последнего экшна. 
        // На основе этой инфы выбирается источник проектов, от которого зависит workBranch.
        // 4. Утверждается рабочая персона, от которой зависит работа updateDate и обновление myLastProject, 
        // а так же superId в friends проектах.
        // 5. Находится рабочий проект, или нет.
        // 6. Находится рабочая версия или нет.
        // 7. И ластовые проверки на существование рабочей высоты, Если хоть чего то нет, то редирект на error.

        const {friends, personObj: {projects, projectsCoordsData, lastProject, lastPerson, userData: {superId}}} = payload;
        state.personObj = payload.personObj // 1

        state.projectsCoordsData = state.personObj.projectsCoordsData; // 1
        state.friends = friends // 1
        // Всегда можно найти себя по этому адресу..
      
        state.workBranch = {};
        
        let projectsCoordInd = [];
        mineInd(projectsCoordsData, lastProject, 'projectId', projectsCoordInd) 
        // по налу он не найдет ничего))

        if(lastPerson === superId) { // спавнимся дома
          /// 
          state.workPerson = superId;
          state.projects = state.personObj.projects;
          ///
          if(projectsCoordInd.length) { 
            state.workPCD = state.projectsCoordsData[projectsCoordInd[0]];
            let lockInd = [];
            mineInd(projects, lastProject, 'superId', lockInd);

            if(lockInd.length) {

              
              let versionInd = [];
              mineInd(state.projects[lockInd[0]].versions, state.workPCD.workVersion, 'superId', versionInd)

              if(versionInd.length) {

                state.workBranch = state.projects[lockInd[0]].versions[versionInd[0]].data;
                let path = state.workPCD[state.workPCD.workVersion].path.substring(1);
                pathReducer(path, state)
              
                if(state.workBranch !== 'None') { 
                  checkBottomData(() => state.mainPlace = 'editor')
                } else {
                  returnError()
                }

              } else {
                returnError()
              }

              // if(projectsCoordInd[0] !== null) { /// Нужно еще branch и path чекать.... Ебаа
              //   // Уже есть проект 
                
      
              // } else { /// PCD CHECK NAT
              //   // еще нет проектов 
              //   state.workPCD = null
              //   state.workBranch.branch = {};
              //   state.mainPlace = 'beginner'
              // }
              
            } else {
              returnError(); 
            }

          } else {
            returnError() // PROJECT CHECK
          }
          
        } else { // спавнимся в гостях
          // обработать ошибку с отключенным аксессом и в следствии этого упавшим проектом

          // поиск проекта и метаданных у другого персонажа
          // можно добавлять в друзья, если есть хотя бы один проект
          // ДОДЕЛАТЬ С ДЕБАГЕРОМ...

          // ЧТО ЕСЛИ У ЧЕЛА НЕТ ПРОЕКТОВ????
          // ЗАСЕЙВИТЬ ГДЕ ТО данные персон обjecta;;
          // все норм, только нужно хендлить пустые проекты 
          state.workPerson = lastPerson; // прокинут ийди человечка

          let friendInd = [];
          mineInd(friends, lastPerson, ['userData', 'superId'], friendInd)

          // профиля пока что не удаляются поэтому сейв не нужен

          // friends.forEach(({userData: {superId}}, i) => {
          //   if(lastPerson === superId) {
          //     friendInd = i;
          //   }
          // })
          state.projects = state.friends[friendInd[0]].projects; /// прокинуты проекты



          if(projectsCoordInd.length) {
            state.workPCD = state.projectsCoordsData[projectsCoordInd[0]]; 

            if(lastProject !== null) { // ЕСть с чем работать. юзлесный чек, но историчный, так что сейвлю
              let projectInd = [];
              mineInd(state.projects, lastProject, 'superId', projectInd);

              if(projectInd.length) {
                
                let versionInd = [];
                mineInd(state.projects[projectInd[0]].versions, state.workPCD.workVersion, 'superId', versionInd)
                
                if(versionInd.length) {
                  state.workBranch = state.projects[projectInd[0]].versions[versionInd].data  // прокинут ворк бренч.
                  let path = state.workPCD[state.workPCD.workVersion].path.substring(1);
                  pathReducer(path, state)
                  if(state.workBranch !== 'None') {
                    checkBottomData(() => state.mainPlace = 'editor')
                  } else {
                    returnError()
                  }
                } else {
                  returnError()
                }
              
              } else {
                returnError()
              }
  
            } else { // юзлес вроде. УДали.
              state.workPCD = null;
              state.workBranch.branch = {};
              state.mainPlace = 'choose'
            }

          } else {
            returnError()
          }

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
  function pathReducer(path, state) { /// переместить это чудо функцию наверх
    while(path.length) {
      state.workBranch = state.workBranch?.branch?.['q'+(path?.[0] ?? 'none')] ?? "None";
      path = path.substring(1);
    };
  };
}

