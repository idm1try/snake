import Link from 'next/link'
import { TbHome } from 'react-icons/tb'

const NotFound = () => (
  <div className='animate-fade_in_up text-center'>
    <div className='my-10'>
      <h1 className='text-5xl font-bold text-teal-600 dark:text-teal-300'>
        404
      </h1>
      <p className='my-5 text-xl font-medium'>Oops, not found</p>
    </div>
    <Link href='/'>
      <button className='mt-3 rounded-lg bg-teal-600 py-2 px-4 font-bold text-white transition-colors duration-200 hover:bg-teal-700 active:bg-teal-800 dark:bg-teal-300 dark:text-zinc-900 dark:hover:bg-teal-400 dark:active:bg-teal-500'>
        <TbHome className='mb-1 inline-block' /> Go to home
      </button>
    </Link>
  </div>
)

export default NotFound
