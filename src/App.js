import React, { useEffect, useState } from 'react'
import * as XLSX from "xlsx";
import { SearchIcon, ShowMoreIcon } from './styles/icons';
import './styles/App.css'
import Logo from './logo.png'

const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']

const subjectArray = ["Математика", "Русский", "Физика", "Обществознание", "Иностранный язык", "Литература", "История"]

function App() {

  const [data, setData] = useState(false)

  const [currentValues, setCurrentValues] = useState({
    subject: "Выберите предмет",
    title: "Выберите тему"
  })

  const [collapseOpened, setCollapseOpened] = useState({
    subject: false,
    title: false
  })

  const [titles, setTitles] = useState([])

  const [currentUmtypes, setCurrentUmtypes] = useState(false) 
  const [searchData, setSearchData] = useState([])
  const [searchValue, setSearchValue] = useState('')
  const [finalText, setFinalText] = useState('')
  const [checkedList, setCheckedList] = useState([])

  const fileUpload = async text => { // перевод из xlsx в массив ячеек
    const fetchStr = 'http://185.189.167.8/umschool-excel/src/files/УМТИПЫ_'+text+'.xlsx'
    await fetch(fetchStr).then( response => {
     console.log('okey')
      console.log(response)
    }) // запрос
    console.log(file)
    console.log('loaded')
    const reader = new FileReader();

    reader.onload = (evt) => { 
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const worksheetname = wb.SheetNames[0];
      const worksheet = wb.Sheets[worksheetname]; // парсинг excel-файла
      
      let arrayOfTitles = [] // массив заголовков. Ниже - объект массивов значений по колонкам 
      const arrayDraft = {'A': [], 'B': [], 'C': [], 'D': [], 'E': [], 'F': [], 'G': [], 'H': [], 'I': [], 'J': [], 'K': [], 'L': [], 'M': [], 'N': [], 'O': [], 'P': [], 'Q': [], 'R': [], 'S': [], 'T': [], 'U': [], 'V': [], 'W': [], 'X': [], 'Y': [], 'Z': []}
      
      Object.keys(worksheet).forEach( elem => { // перебор всех ячеек
        let letter = worksheet[elem]

        if ((elem.length == 2) && elem[1] == '1') { // если название ячейки вида "буква - 1", тогда это заголовок

          arrayOfTitles.push({title: letter.h, letter: elem[0]}) // добавляем заголовок

        } else if (arrayDraft[elem[0]] !== undefined) { // если же нет
          let index = elem[0]
          arrayDraft[index].push(letter.h) // тогда добавляем значение ячейки в массив с нужной литерой
        }
      })
      
      setTitles(arrayOfTitles)
      setData(arrayDraft)
    };
    reader.readAsBinaryString(file);
  }

  const toggleCollapseOpened = (name) => { // проверяем открыт ли коллапс
    if (collapseOpened[name]) {
      setCollapseOpened({[name]: false})
    } else {
      setCollapseOpened({[name]: true})
    }
  }

  const changeSearch = (text) => { // поиск

    if ( (currentUmtypes) && (currentUmtypes.length !== 0) && (typeof text ==='string') && (text.length >= 3)) { // необходимая проверка соотвествия всех значений
      
      let newData = []
      currentUmtypes.forEach( elem => {

        if ((typeof elem == 'string') && (elem.toLowerCase().includes(text))) {
          newData.push(
            { // код ниже отвечает за вставку в элемент background оранжевого цвета
              html: <>
                { elem.slice(0, elem.toLowerCase().indexOf(text.toLowerCase())) }
                <span style={{background: '#F19137'}}>{text}</span>
                { elem.slice( elem.toLowerCase().indexOf(text.toLowerCase())+text.length )}
                </>,
              text: elem // однако всё равно нужно передавать просто строку
            }
          )
        } 
      })
      
      setSearchData( newData )

    } else {
      setSearchData(currentUmtypes) // необходимо для тех случаев, когда строка в поиске стирается и становится меньше 3
    }

    setSearchValue(text)

  }

  const changeCheckbox = (text) => { // вызывается при выборе умтипа

    if ( checkedList.includes(text) ) { // проверка того, выбран ли этот умтип 
      
      if ( checkedList.indexOf(text) === 0 ) { // это условие нужно для правильного отображения строки
        setFinalText( finalText.slice( text.length+2 ) ) // учтём условие, что убираемый элемент первый
      } else if (checkedList.indexOf(text) === checkedList.length-1) { // учтём условие, что убираемый элемент последний
        setFinalText( finalText.slice(0, finalText.indexOf(text)-2 ) + finalText.slice( finalText.indexOf(text)+text.length+2 ) )
      } else { // условие, что убираемый текст в середине
        setFinalText( finalText.slice(0, finalText.indexOf(text)-2 ) + finalText.slice( finalText.indexOf(text)+text.length ) )
      }

      let newArray = checkedList // вообще, checkedList нужен для отображения галочек у выбранных умтипов
      newArray.splice( checkedList.indexOf(text) , 1) // убираем умтип
      
      setCheckedList( newArray )
      
    } else { // добавляем умтип

      if (finalText !== '') { // если это не первый умтип, тогда с запятой
        setFinalText( finalText + ', ' + text)
      } else {
        setFinalText(text) // если первый, тогда пока без запятой
      }
      setCheckedList([...checkedList, text])

    }

  }

  return (
    <div>
            {/* <form enctype="multipart/form-data" style={{position: 'absolute', top: '0', right: '120px'}}>
          <input id="upload" type='file'  name="files[]" onChange={ e => fileUploaded(e) }/>
      </form> */}

    <img src={Logo} alt='logo' id='logo' /> 
    <div className='app'>


      <div className='panel-wrapper'> 
        <div className='row'>
          {/* первый коллапс */}
          <div className={`collapse subject bordered ${ collapseOpened.subject ? 'openedPanel' : '' }`} onClick={() => toggleCollapseOpened('subject')}>
              <span>
                {
                  currentValues.subject
                }
              </span>
              <div className={`arrow-svg ${ collapseOpened.subject ? 'rotated' : '' }`}><ShowMoreIcon /></div>
          </div>
          {/* открывающаяся часть первого коллапса */}
          <div className={`collapse-list ${ collapseOpened.subject ? 'opened opened-list-subjects' : '' }`}>
              {
                collapseOpened.subject 
                &&
                subjectArray.map(elem => (
                  <div className='collapse-opened-elem' 
                    onClick={() => {
                      console.log(elem)
                      fileUpload(elem) // при клике на нужный предмет,загружается этот файл
                      setCollapseOpened({subject: false, title: false}) // также закрывается этот коллапс
                      setCurrentValues({subject: elem, title: 'Выберите тему'}) // и записывается название предмета
                    }}
                  >
                    {elem}
                  </div>
                ))
              }
          </div>

          {/* второй коллапса */}
          <div className={`collapse title bordered ${ collapseOpened.title ? 'openedPanel' : '' }`} onClick={() => toggleCollapseOpened('title')}>
              <span>
                {
                  currentValues.title
                }
              </span>
              <div className={`arrow-svg ${ collapseOpened.title ? 'rotated' : '' }`}><ShowMoreIcon /></div>
          </div>
        </div>
        {/* открывающаяся часть второго коллапса */}
        <div className={`collapse-list title-collapse ${ collapseOpened.title && (currentValues.subject !== 'Выберите предмет')  ? 'opened opened-list-titles' : '' }`}>
              {
                collapseOpened.title 
                &&
                (currentValues.subject !== 'Выберите предмет')
                &&
                titles.map(elem => (
                  <div className='collapse-opened-elem' 
                    onClick={() => {
                      setCollapseOpened({subject: false, title: false}) // закрываем оба коллапса при выборе темы
                      setCurrentValues({...currentValues, title: elem.title}) // записываем выбранную тему
                      setCurrentUmtypes( data[elem.letter] ) // текущий список умтипов
                      setSearchValue('') // очищаем строку поиска
                      setSearchData( data[elem.letter] ) // отображаем список умтипов
                    }}
                  >
                    {elem.title}
                  </div>
                ))
              }
          </div>
        
        {/* поиск обыкновенный */}
        <div className='search-wrapper bordered'>
              <input type='text' placeholder='ПОИСК...' onChange={ e => changeSearch(e.target.value)} value={searchValue}/>
              <SearchIcon />
        </div>

        {/* дисплей умтипов */}
        <div className='umtypes-display bordered'>
          {
            searchData.length > 0
            ?
            searchData.map( elem => {
              if (typeof elem !== 'string') {             // условие необходимо для распознавания массмв объектов или строк
                return (                                  // здесь объект тогда, когда отображаем умтипы в зависимости от поиска
                  <div className='umtype-element' >       
                    <input type='checkbox' checked={ checkedList.includes(elem.text) } onChange={ () => changeCheckbox(elem.text) }/>
                    <span>{elem.html}</span>
                  </div>
                )
              } else {
                return (
                  <div className='umtype-element' >
                    <input type='checkbox' checked={ checkedList.includes(elem) } onChange={ () => changeCheckbox(elem) }/>
                    <span>{elem}</span>
                  </div>
                )
              }

            })
            :
            <div className='none-display'>Пожалуйста, выберите предмет и тему</div> // если пока не выбраны предмет и темы
          }
        </div>

      </div>
        
      {/* отображение строк, всё оень просто */}
      <div className='display-wrapper bordered'>
          {
            (finalText !== '') 
            ?
            <div className='display'>{finalText}</div>
            : 
            <div className='none-display'>Здесь будет текст...</div>
          }

          
          <div className='display-panel'>
            <div className='copy button' onClick={ () => { navigator.clipboard.writeText(finalText) } }>Копировать</div>
            <div className='clear button' onClick={ () => { setCheckedList([]); setFinalText('') }}>Очистить</div>
          </div>
      </div>
    </div>
    </div>
  )
}

export default App;
