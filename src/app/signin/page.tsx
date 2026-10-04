import Link from 'next/link'
import React from 'react'

const page = async ({searchParams} : {searchParams:Promise<{[key:string]:string | undefined}>}) => {
  const resolvedParams = await searchParams;
  const callbackUrl = resolvedParams.callbackUrl || '/home';
  return (
    <Link href={`/api/auth/google?callback=${callbackUrl}`} >Sign In With Google</Link>
  )
}

export default page