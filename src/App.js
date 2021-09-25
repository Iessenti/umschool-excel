import React, { useEffect, useState } from 'react'
import * as XLSX from "xlsx";
import axios from 'axios'
import { SearchIcon, ShowMoreIcon } from './styles/icons';
import './styles/App.css'
import Logo from './logo.png'

const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']

const subjectArray = ["Математика", "Русский", "Физика", "Обществознание", "Литература", "История", "Немецкий", "Английский", "Химия", "Биология"]

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
  const [checkedIdList, setCheckedIdList] = useState([])


  const fileUpload = str => { // перевод из xlsx в массив ячеек
    const fetchStr = 'http://185.189.167.8/files/УМИТЫ_'+str+'.xlsx'
    axios({
        url: fetchStr,
        method: 'GET',
        headers: { 'Accept': 'application/vnd.ms-excel' },
        responseType: 'blob'
    }).then( response => {
        console.log(response.data)
        console.log( new Blob([response.data]) )
        const file = new Blob([response.data])
        const reader = new FileReader();
    
        reader.onload = (evt) => {
          const bstr = evt.target.result;
          const wb = XLSX.read(bstr, { type: "binary" });
          const worksheetname = wb.SheetNames[0];
          const worksheet = wb.Sheets[worksheetname];

          let arrayOfTitles = []
          const arrayDraft = {'A': [], 'B': [], 'C': [], 'D': [], 'E': [], 'F': [], 'G': [], 'H': [], 'I': [], 'J': [], 'K': [], 'L': [], 'M': [], 'N': [], 'O': [], 'P': [], 'Q': [], 'R': [], 'S': [], 'T': [], 'U': [], 'V': [], 'W': [], 'X': [], 'Y': [], 'Z': []}
          
          
          let mainKeys = ['A', 'C', 'E', 'G', 'I', 'K', 'M', 'O', 'Q', 'S', 'U', 'W', 'Y']
          let secondKeys = ['B', 'D', 'F', 'H', 'J', 'L', 'N', 'P', 'R', 'T', 'V', 'X', 'Z']

          Object.keys(worksheet).forEach( elem => {
            let letter = worksheet[elem]
            
            if ( (elem.length == 2) && (elem[1] == '1') && ( secondKeys.indexOf(elem[0]) == -1 ) ) {
              arrayOfTitles.push({title: letter.h, letter: elem[0]})
            } else if ( (arrayDraft[elem[0]] !== undefined) && ( mainKeys.indexOf(elem[0]) !== -1 ) )  {
              
              let index = elem[0]
              
              arrayDraft[index].push(worksheet[ secondKeys[ mainKeys.indexOf(index) ] + elem.slice(1) ].w + '#' + letter.h )
            }
          })
          
          setTitles(arrayOfTitles)
          setData(arrayDraft)
        };
        reader.readAsBinaryString(file);
    })
  }


  const toggleCollapseOpened = (name) => {
    if (collapseOpened[name]) {
      setCollapseOpened({[name]: false})
    } else {
      setCollapseOpened({[name]: true})
    }
  }

  const changeSearch = (text) => {

    if ( (currentUmtypes) && (currentUmtypes.length !== 0) && (typeof text ==='string') && (text.length >= 3)) {
      
      let newData = []
      currentUmtypes.forEach( elem => {

        if ((typeof elem == 'string') && (elem.toLowerCase().includes(text))) {
          newData.push(
            { 
              html: <>
                { elem.slice( elem.indexOf('#')+1, elem.toLowerCase().indexOf(text.toLowerCase())) }
                <span style={{background: '#F19137'}}>{text}</span>
                { elem.slice( elem.toLowerCase().indexOf(text.toLowerCase())+text.length )}
                </>,
              text: elem
            }
          )
        } 
      })
      
      setSearchData( newData )

    } else {
      setSearchData(currentUmtypes)
    }

    setSearchValue(text)

  }

  const changeCheckbox = (t) => {
    const id = t.slice(0, t.indexOf('#') )
    console.log(id)

    const text = t.slice( t.indexOf('#') + 1)

    if ( checkedList.includes(text) ) {
      
      if ( checkedList.indexOf(text) === 0 ) {
        setFinalText( finalText.slice( text.length+2 ) )
      } else if (checkedList.indexOf(text) === checkedList.length-1) {
        setFinalText( finalText.slice(0, finalText.indexOf(text)-2 ) + finalText.slice( finalText.indexOf(text)+text.length+2 ) )
      } else {
        setFinalText( finalText.slice(0, finalText.indexOf(text)-2 ) + finalText.slice( finalText.indexOf(text)+text.length ) )
      }

      let newArray = checkedList
      newArray.splice( checkedList.indexOf(text) , 1) 
      setCheckedList( newArray )

      let idNewArray = checkedIdList
      idNewArray.splice( checkedIdList.indexOf(id) )
      setCheckedIdList(idNewArray)
      
    } else {

      if (finalText !== '') {
        setFinalText( finalText + ', ' + text)
      } else {
        setFinalText(text)
      }
      
      setCheckedList([...checkedList, text])
      setCheckedIdList([...checkedIdList, id  + ' '])
    }

  }


  return (
    <div>
{/* 
      <form encType="multipart/form-data" style={{position: 'absolute', top: '0', right: '120px'}}>
         <input id="upload" type='file'  name="files[]" onChange={ e => fileUploaded(e.target.files[0]) }/>
      </form> */}

    <img src={Logo} alt='logo' id='logo' />
    <div className='app'>


      <div className='panel-wrapper'>
        <div className='row'>

          <div className={`collapse subject bordered ${ collapseOpened.subject ? 'openedPanel' : '' }`} onClick={() => toggleCollapseOpened('subject')}>
              <span>
                {
                  currentValues.subject
                }
              </span>
              <div className={`arrow-svg ${ collapseOpened.subject ? 'rotated' : '' }`}><ShowMoreIcon /></div>
          </div>

          <div className={`collapse-list ${ collapseOpened.subject ? 'opened opened-list-subjects' : '' }`}>
              {
                collapseOpened.subject 
                &&
                subjectArray.map(elem => (
                  <div className='collapse-opened-elem' 
                    onClick={() => {
                      fileUpload(elem)
                      setCollapseOpened({subject: false, title: false})
                      setCurrentValues({subject: elem, title: 'Выберите тему'})
                    }}
                  >
                    {elem}
                  </div>
                ))
              }
          </div>

          <div className={`collapse title bordered ${ collapseOpened.title ? 'openedPanel' : '' }`} onClick={() => toggleCollapseOpened('title')}>
              <span>
                {
                  currentValues.title
                }
              </span>
              <div className={`arrow-svg ${ collapseOpened.title ? 'rotated' : '' }`}><ShowMoreIcon /></div>
          </div>
        </div>

        <div className={`collapse-list title-collapse ${ collapseOpened.title && (currentValues.subject !== 'Выберите предмет')  ? 'opened opened-list-titles' : '' }`}>
              {
                collapseOpened.title 
                &&
                (currentValues.subject !== 'Выберите предмет')
                &&
                titles.map(elem => (
                  <div className='collapse-opened-elem' 
                    onClick={() => {
                      setCollapseOpened({subject: false, title: false})
                      setCurrentValues({...currentValues, title: elem.title})
                      setCurrentUmtypes( data[elem.letter] )
                      setSearchValue('')
                      setSearchData( data[elem.letter] )
                    }}
                  >
                    {elem.title}
                  </div>
                ))
              }
          </div>
        
        <div className='search-wrapper bordered'>
              <input type='text' placeholder='ПОИСК...' onChange={ e => changeSearch(e.target.value)} value={searchValue}/>
              <SearchIcon />
        </div>

        <div className='umtypes-display bordered'>
          {
            searchData.length > 0
            ?
            searchData.map( elem => {
              if (typeof elem !== 'string') {
                return (
                  <div className='umtype-element' >
                    <input type='checkbox' checked={ checkedList.includes(elem.text.slice( elem.text.indexOf('#') + 1 ))  } onChange={ () => changeCheckbox(elem.text) }/>
                    <span>{elem.html}</span>
                  </div>
                )
              } else {
                return (
                  <div className='umtype-element' >
                    <input type='checkbox' checked={ checkedList.includes(elem.slice( elem.indexOf('#') + 1 )) } onChange={ () => changeCheckbox(elem) }/>
                    <span>{elem.slice( elem.indexOf('#')+1 )}</span>
                  </div>
                )
              }

            })
            :
            <div className='none-display'>Пожалуйста, выберите предмет и тему</div>
          }
        </div>

      </div>

      <div className='display-wrapper bordered'>
          {
            (finalText !== '') 
            ?
            <div className='display'>{finalText}</div>
            : 
            <div className='none-display'>Здесь будет текст...</div>
          }


          <div>
                  {
                    checkedIdList
                  }
          </div>
          
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
