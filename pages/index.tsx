import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
// import Image from 'next/image'
import Layout, { siteTitle } from '../components/layout'
// import utilStyles from '../styles/utils.module.css'
import ReactPaginate from 'react-paginate';

export default function Home() {

  const [items, setItems] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [keyword, setKeyword] = useState('');
  const [pageCount, setPageCount] = useState(0);
  const [isThrottlingError, setThrottlingError] = useState(false);
  const perPage = 10;

  useEffect(() => {
    if (keyword === '') return

    const params = { 
      keyword: keyword,
      perPage: perPage,
      page: 1, 
    }
    requestAPI(params)
  }, [keyword])

  useEffect(() => {
    if (keyword === '') return

    const params = { 
      keyword: keyword,
      perPage: perPage,
      page: currentPage, 
    }
    requestAPI(params)
  }, [currentPage])

  // APIリクエスト
  const requestAPI = async (params:{
    keyword: string,
    perPage: number,
    page: number
  }) => {

    if (isValidThrottling()) {
      setThrottlingError(false)
    } else {
      setThrottlingError(true)
      return
    }

    const query = new URLSearchParams({...params, perPage: params.perPage.toString(), page: params.page.toString()})
    const response = await fetch(`/api/search?${query}`)
    const data = await response.json()
    const repositoriesList = data.items
    const count = data.total_count

    setItems(repositoriesList)
    setTotalCount(count)
    // github APIの最大件数は1000件
    const pageTotalCount = count <= 1000 ? count : 1000
    setPageCount(Math.ceil(pageTotalCount/perPage))
  }

  // searchボタン押下
  const onSubmitSearch = (e) => {
    e.preventDefault()
    const { currentTarget = {} } = e
    const fields = Array.from(currentTarget?.elements)
    const fieldQuery: any = fields.find((field: any) => field.name === 'query')
    const value = fieldQuery.value || ''
    setKeyword(value)
  }

  // ページネーションボタン押下
  const onClickPage = (event) => {
    setCurrentPage(event.selected+1)
  };

  // スロットリング制御：1分間に１０リクエストまで許可
  const isValidThrottling = () => {
    const limitTime = 60000
    const limitNum = 10
    // 現在時間、前回リクエストした時間,リクエスト回数を取得　
    const currentTime = new Date().getTime()
    const requestTime = localStorage.getItem('requestTime') === null ? 0 : Number(localStorage.getItem('requestTime'))
    const requestNum = localStorage.getItem('requestNum') === null ? 0 : Number(localStorage.getItem('requestNum'))

    // 前回時間と現在時間を比較し、60秒以上経っていたらリクエスト時間を更新し、リクエスト回数をリセット
    if ((currentTime - requestTime) > limitTime) {
      localStorage.setItem('requestTime', String(currentTime))
      localStorage.setItem('requestNum', String(1))
      return true
    }
    // 前回リクエスト回数が10未満ならOK、リクエスト回数に+1
    if (requestNum < limitNum) {
      localStorage.setItem('requestNum', String(requestNum+1))
      return true
    }

    return false
  }

  return (
    <Layout>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className="mb-3">
        <form onSubmit={onSubmitSearch} className="text-center">
          <input
            type="search"
            name="query"
            className="rounded py-2 px-4 text-left border-gray-300 border-solid border-2"
            placeholder="Please enter keywords"
          />
          <button className="ml-2 text-white bg-blue-500 rounded py-2 px-6 border-solid border-2 border-blue-500 hover:opacity-75">
            Search
          </button>
        </form>
      </section>
      {isThrottlingError && <p className="text-center text-red-500 mb-4">Please wait a moment</p>}
      <section>
        {totalCount > 0 && <p className="text-center text-sm text-gray-500">page&nbsp;{currentPage}&nbsp;of&nbsp;{totalCount.toLocaleString()}&nbsp;results</p>}
        {totalCount === 0 && <p className="text-center text-sm text-gray-500">{totalCount.toLocaleString()}&nbsp;results</p>}
        <ul className="mt-7">
          {items.map((item) => {
            return (
              <li key={item.id} className="mb-4 mx-4 px-3 py-2 rounded border-solid border-1 shadow border-gray-400">
                <Link href={item.html_url} ><a className="font-bold text-lg" target="_blank">{item.full_name}</a></Link>
                <div className="text-sm text-gray-600">{item.description}</div>
              </li>
            )
          })}
        </ul>
      </section>
      <section className="mt-10 mb-20 mx-6">
        <ReactPaginate
          breakLabel="..."
          nextLabel=">"
          onPageChange={onClickPage}
          pageRangeDisplayed={2}
          marginPagesDisplayed={1}
          pageCount={pageCount}
          previousLabel="<"
          renderOnZeroPageCount={null}
          activeClassName="active"
          containerClassName="flex justify-center pagination"
          pageClassName="px-5"
        />
      </section>
    </Layout>
  )
}