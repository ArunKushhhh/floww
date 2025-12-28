import { Loader2 } from 'lucide-react';
import React from 'react'

function loading() {
  return (
    <div className='h-screen w-full flex justify-center items-center'>
        <Loader2 className='size-4 animate-spin' />
    </div>
  )
}

export default loading