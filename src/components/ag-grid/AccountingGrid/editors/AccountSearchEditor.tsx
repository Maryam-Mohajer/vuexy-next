import { useRef, useState, useCallback, useEffect } from 'react'
import { ICellEditorParams } from 'ag-grid-community'
import Select from 'react-select'

interface ApiOption {
  id: number
  title: string
}

interface SelectOption {
  value: number
  label: string
}

const PAGE_SIZE = 5

const DynamicAsyncSelectEditor = (props: ICellEditorParams) => {
  const [inputValue, setInputValue] = useState('')

  const pageRef = useRef(1)
  const hasMoreRef = useRef(true)
  const searchRef = useRef('')

  const [options, setOptions] = useState<SelectOption[]>([])
  const [loading, setLoading] = useState(false)

  const fetchPage = async (search: string, page: number) => {
    const res = await fetch(`/api/accounts?search=${search}&page=${page}&pageSize=${PAGE_SIZE}`)
    const json = await res.json()

    return {
      options: json.data.map((item: ApiOption) => ({
        value: item.id,
        label: item.title
      })),
      hasMore: json.hasMore
    }
  }

  const handleInputChange = (value: string) => {
    setInputValue(value)
    pageRef.current = 1
    hasMoreRef.current = true
    setOptions([])
  }

  useEffect(() => {
    if (!inputValue) return

    const fetchData = async () => {
      setLoading(true)
      const result = await fetchPage(inputValue, 1)
      setOptions(result.options)
      hasMoreRef.current = result.hasMore
      setLoading(false)
    }

    fetchData()
  }, [inputValue])

  const loadMore = useCallback(async () => {
    if (loading || !hasMoreRef.current) return

    setLoading(true)
    const nextPage = pageRef.current + 1
    const result = await fetchPage(searchRef.current, nextPage)

    pageRef.current = nextPage
    hasMoreRef.current = result.hasMore

    setOptions(prev => [...prev, ...result.options])
    setLoading(false)
  }, [loading])

  return (
    <div style={{ width: props.eGridCell?.offsetWidth ?? 300 }}>
      <Select
        autoFocus
        options={options}
        onInputChange={handleInputChange}
        onMenuScrollToBottom={loadMore}
        isLoading={loading}
        maxMenuHeight={200}
        value={props.value ? { value: props.value.id, label: props.value.title } : null}
        onChange={(selected: any) => {
          if (selected) {
            props.node.setDataValue(props.colDef.field!, { id: selected.value, title: selected.label })
            props.api.stopEditing()
          }
        }}
        onBlur={() => props.api.stopEditing()}
        placeholder='جستجو حساب...'
        noOptionsMessage={() => (loading ? 'در حال بارگذاری...' : 'موردی یافت نشد')}
      />
    </div>
  )
}

export default DynamicAsyncSelectEditor
//--------------------------------------------------------------------------------------------------------------------------------

// import { useRef, useState, useCallback } from 'react'
// import { ICellEditorParams } from 'ag-grid-community'
// import AsyncSelect from 'react-select/async'

// interface ApiOption {
//   id: string
//   title: string
// }

// interface SelectOption {
//   value: number
//   label: string
// }

// const PAGE_SIZE = 5

// const DynamicAsyncSelectEditor = (props: ICellEditorParams) => {
//   const pageRef = useRef(1)
//   const hasMoreRef = useRef(true)
//   const searchRef = useRef('')

//   const [options, setOptions] = useState<SelectOption[]>([])
//   const [loading, setLoading] = useState(false)

//   // 🔹 fetch یک صفحه
//   const fetchPage = async (search: string, page: number) => {
//     const res = await fetch(`/api/accounts?search=${search}&page=${page}&pageSize=${PAGE_SIZE}`)
//     const json = await res.json()

//     return {
//       options: json.data.map((item: ApiOption) => ({
//         value: item.id,
//         label: item.title
//       })),
//       hasMore: json.hasMore
//     }
//   }

//   // 🔹 سرچ جدید
//   const loadOptions = async (inputValue: string) => {
//     searchRef.current = inputValue
//     pageRef.current = 1
//     hasMoreRef.current = true

//     if (!inputValue) {
//       setOptions([])
//       return []
//     }

//     setLoading(true)

//     const result = await fetchPage(inputValue, 1)

//     setOptions(result.options)
//     hasMoreRef.current = result.hasMore

//     setLoading(false)

//     return result.options
//   }

//   // 🔹 اسکرول به انتها
//   const loadMore = useCallback(async () => {
//     if (loading || !hasMoreRef.current) return

//     setLoading(true)

//     const nextPage = pageRef.current + 1
//     const result = await fetchPage(searchRef.current, nextPage)

//     pageRef.current = nextPage
//     hasMoreRef.current = result.hasMore

//     setOptions(prev => [...prev, ...result.options])

//     setLoading(false)
//   }, [loading])

//   return (
//     <div style={{ width: props.eGridCell?.offsetWidth ?? 300 }}>
//       <AsyncSelect
//         autoFocus
//         cacheOptions={false}
//         defaultOptions={false}
//         loadOptions={loadOptions}
//         options={options}
//         onMenuScrollToBottom={loadMore}
//         isLoading={loading}
//         menuPlacement='auto'
//         maxMenuHeight={200} // ✅ خیلی مهم
//         styles={{
//           menuList: base => ({
//             ...base,
//             maxHeight: 200,
//             overflowY: 'auto'
//           })
//         }}
//         value={props.value ? { value: props.value.id, label: props.value.title } : null}
//         onChange={(selected: any) => {
//           if (selected) {
//             props.node.setDataValue(props.colDef.field!, { id: selected.value, title: selected.label })
//             props.api.stopEditing()
//           }
//         }}
//         onBlur={() => props.api.stopEditing()}
//         placeholder='جستجو حساب...'
//         noOptionsMessage={() => (loading ? 'در حال بارگذاری...' : 'موردی یافت نشد')}
//       />
//     </div>
//   )
// }

// export default DynamicAsyncSelectEditor

//--------------------------------------------------------------------------------------------------------------------------------

// import { forwardRef } from 'react'
// import { ICellEditorParams } from 'ag-grid-community'
// import AsyncSelect from 'react-select/async'

// interface Option {
//   id: string
//   title: string
// }

// const DynamicAsyncSelectEditor = forwardRef((props: ICellEditorParams, ref) => {
//   const loadOptions = async (inputValue: string) => {
//     if (!inputValue) return []
//     try {
//       const res = await fetch(`/api/accounts?search=${inputValue}`)
//       const data: Option[] = await res.json()
//       return data.map(opt => ({ value: opt.id, label: opt.title }))
//     } catch (err) {
//       console.error(err)
//       return []
//     }
//   }

//   return (
//     <div
//       style={{
//         width: props.eGridCell?.offsetWidth ?? 300
//       }}
//     >
//       <AsyncSelect
//         autoFocus
//         cacheOptions
//         defaultOptions
//         loadOptions={loadOptions}
//         value={props.value ? { value: props.value.id, label: props.value.title } : null}
//         onChange={(selected: any) => {
//           if (selected) {
//             props.node.setDataValue(props.colDef.field!, { id: selected.value, title: selected.label })
//             props.api.stopEditing()
//           }
//         }}
//         onBlur={() => props.api.stopEditing()}
//         placeholder='جستجو حساب...'
//       />
//     </div>
//   )
// })

// export default DynamicAsyncSelectEditor

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
