import { forwardRef, useRef } from 'react'
import { ICellEditorParams } from 'ag-grid-community'
import AsyncSelect from 'react-select/async'

interface Option {
  id: string
  title: string
}

const DynamicAsyncSelectEditor = forwardRef((props: ICellEditorParams, ref) => {
  const wrapperRef = useRef<HTMLDivElement>(null)
  // تابع async برای بارگذاری گزینه‌ها
  const loadOptions = async (inputValue: string) => {
    if (!inputValue) return []
    try {
      const res = await fetch(`/api/accounts?search=${inputValue}`)
      const data: Option[] = await res.json()
      return data.map(opt => ({ value: opt.id, label: opt.title }))
    } catch (err) {
      console.error(err)
      return []
    }
  }


  const cellHeight = props.eGridCell?.offsetHeight ?? 32;

  return (
    <div
      ref={wrapperRef}
      style={{
        width: '100%', // ✅ کلیدی
        minWidth: props.eGridCell?.offsetWidth // ✅ هم‌عرض سلول
      }}
    >
      <AsyncSelect
        autoFocus
        cacheOptions
        defaultOptions
        loadOptions={loadOptions}
        value={props.value ? { value: props.value.id, label: props.value.title } : null}
        onChange={(selected: any) => {
          if (selected) {
            props.node.setDataValue(props.colDef.field!, { id: selected.value, title: selected.label })
            props.api.stopEditing()
          }
        }}
        menuPortalTarget={document.body}
        menuPosition='fixed'
styles={{
  control: base => ({
    ...base,
    backgroundColor: '#fff',       // جدا از متن سلول
    border: '1px solid #cfd4dc',  
    boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
    minHeight: cellHeight,          // ثابت
    height: cellHeight              // مهم: جلوگیری از افزایش ارتفاع
  }),
  valueContainer: base => ({
    ...base,
    padding: '0 8px'
  }),
  indicatorSeparator: () => ({ display: 'none' }),
  dropdownIndicator: () => ({ display: 'none' }),
  menuPortal: base => ({
    ...base,
    zIndex: 999999
  })
}}
        placeholder='جستجو حساب...'
        isClearable
      />
    </div>
  )
})

export default DynamicAsyncSelectEditor

//--------------------------------------------------------------------------------------------------------------------------------

// import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
// import { ICellEditorParams } from 'ag-grid-community'
// import { createPortal } from 'react-dom'

// interface Option {
//   id: string
//   title: string
// }

// const DynamicSelectEditor = forwardRef((props: ICellEditorParams, ref) => {
//   const [options, setOptions] = useState<Option[]>([])
//   const [value, setValue] = useState(props.value?.title || '')
//   const inputRef = useRef<HTMLInputElement>(null)

//   // تمرکز روی input وقتی سلول باز میشه
//   useEffect(() => inputRef.current?.focus(), [])

//   // گرفتن گزینه‌ها با تایپ
//   useEffect(() => {
//     if (!value) return setOptions([])

//     const timeout = setTimeout(async () => {
//       try {
//         const res = await fetch(`/api/accounts?search=${value}`)
//         const data = await res.json()
//         setOptions(data)
//       } catch (err) {
//         console.error(err)
//       }
//     }, 300) // debounce

//     return () => clearTimeout(timeout)
//   }, [value])

//   const handleSelect = (option: Option) => {
//     setValue(option.title)
//     // مقدار را مستقیم روی data بگذار
//     props.node.setDataValue(props.colDef.field!, option)

//     props.api.stopEditing()
//   }

//   return (
//     <div style={{ position: 'relative' }}>
//       <input
//         ref={inputRef}
//         value={value}
//         onChange={e => setValue(e.target.value)}
//         className='ag-input'
//         style={{ width: '100%' }}
//       />
//       {options.length > 0 &&
//         createPortal(
//           <div
//             style={{
//               position: 'absolute',
//               top: inputRef.current!.getBoundingClientRect().bottom + window.scrollY,
//               left: inputRef.current!.getBoundingClientRect().left + window.scrollX,
//               width: inputRef.current!.offsetWidth,
//               maxHeight: 200,
//               overflowY: 'auto',
//               background: '#fff',
//               border: '1px solid #ccc',
//               zIndex: 9999
//             }}
//           >
//             {options.map(opt => (
//               <div key={opt.id} style={{ padding: 6, cursor: 'pointer' }} onClick={() => handleSelect(opt)}>
//                 {opt.title}
//               </div>
//             ))}
//           </div>,
//           document.body
//         )}
//     </div>
//   )
// })

// export default DynamicSelectEditor
