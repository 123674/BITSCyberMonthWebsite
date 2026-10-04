import { IEEE_CS_SOCIETY } from '@/lib/contants'
import Image from 'next/image'
import React from 'react'

const layout = ({ children }: { children: React.JSX.Element }) => {
  return (
    <div>
      <header className='px-16 pt-4 font-Inter'>
        <div className='flex gap-2'>
          <div className=''>
            <Image
              src={IEEE_CS_SOCIETY}
              width={50}
              height={50}
              priority
              alt="IEEE CS SOCIETY LOGO"
              className=''
            />
          </div>
          <div>
            <h5 className='font-bold tracking-tight'>BSMCE IEEE COMPUTER SOCIETY</h5>
            <span className='text-cyan text-[12.4px] '>CYBER MONTH • 2026</span>
          </div>
        </div>
      </header>
      {children}
    </div>
  )
}

export default layout