// у мапы есть выбранный элемент, в котором будет бренч дирекшн дата
// есть инпуты для быстрых перемещений (при огромных вложенностях)
// при выборе проекта или ветви, ворк плейс остается на мапе. Помолимся богу производительности.

// модифицирование сети это ультра лейт... Легче заново собрать.
import React, {useState, useEffect, cloneElement} from 'react'
import {connect} from 'react-redux'
import {boostWorker, WebWorker, mineInd} from '@/utils'

import {Leaf} from '@/components'

import {setMapData, changeBranch} from '@/actions'

import './Map.scss'


const MapBase = ({workPCD, projects, mapStore, mapGrid, mapCurrent, setMapData, workPos, changeBranch}) => {
  const [main, setMain] = useState([])
  debugger
  useEffect(() => {

    if(mapStore == false) { // новые данные, мапы ликвидированы

      const worker = new WebWorker(boostWorker);
      
      let projectInd = [];
      mineInd(projects, workPCD.projectId, 'superId', projectInd)
      let versionInd = [];
      mineInd(projects[projectInd[0]].versions, workPCD.workVersion, 'superId', versionInd)
      
      let natVersion = projects[projectInd[0]].versions[versionInd[0]].data;

      // Делаю фабрику, при создании компонента прилетает мапина дата (массив с React элементами)
      //, а так же сам Грид, если доживают до этого момента)) при их существовании, происходит поиск местоположения
      // старого по выбранности элемента и нового ---> происходит модификация и ресборка МАПЫ. Привет шашки)

      worker.onmessage = function(ev) {
        
        let mapCurrent = workPos;
        let mapGrid = ev.data.grid.slice();
        let mapStore = ev.data.grid.map((line, h) => {
          return line.map(({data}) => {
            return <Leaf clickHandler={() => changeBranch(data.pos)} data={data} current={(data?.pos ?? null) === mapCurrent} />
          })
        });
        console.timeEnd()
        setMapData({mapGrid, mapStore, mapCurrent})
        setMain(mapStore.map(line => (<div className='map__line'>{line}</div>)))
  
        //setMain(main);
      }
      // прогон данных проекта и навешивание высот c выводом в виде 2D []
      console.time()
      worker.postMessage(natVersion);
      
    } else if(mapCurrent !== workPos) { // модификация существующих мап и диспатч новых данных СБОРА НЕТ
      let oldCoord = {};
      let newCoord = {}; // Поиск координат и модификация по их адресам
      mapGrid.forEach((line, h) => {
        line.forEach(({data}, l) => {
          if(data?.pos === workPos) {
            newCoord = {h, l}
          }
          if(data?.pos === mapCurrent) {
            oldCoord = {h, l}
          }
        })
      })
      const {h: oH, l: oL} = oldCoord; const {h: nH, l: nL} = newCoord;
      mapStore[oH][oL] = cloneElement(mapStore[oH][oL], {current: false});
      mapStore[nH][nL] = cloneElement(mapStore[nH][nL], {current: true});
      setMapData({mapGrid, mapStore, mapCurrent: workPos});
      setMain(mapStore.map(line => (<div className='map__line'>{line}</div>)))
    }  // если скидываются данные, все должно просто перерисоваться, до нового скидывания)
  })

  return (
    <div className='map'>
      <div className='map__top'>
        <div className='map__top_space'>

        </div>
        <div className='map__top_mainPart'>
         
          <div className='map__top_mainPart_wrapper'>
            <div className='map__top_mainPart_space'></div>
            <div className='map__top_mainPart_wrapper_row'>
              <div> {main}</div>
              <div className='map__top_mainPart_space_row'>

              </div>
            </div>
            {/* <div className='plug'>
              2
            </div> */}
          </div>
        </div>
        <div className='map__top_space'>

        </div>
      </div>
      <div className='map__bottom'>
        <div className='map__bottom_space'>

        </div>
      </div>
    </div>
  )
}

export default connect(({main: {workPCD, projects, mapStore, mapGrid, mapCurrent}}) => ({
  workPCD, projects, mapStore, mapGrid, mapCurrent, workPos: workPCD[workPCD.workVersion].path,
}), {setMapData, changeBranch})(MapBase) ;
