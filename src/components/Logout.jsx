"use client";

import { doLogout } from "@/app/actions"



import React from 'react';


const Logout = () => {
  return (
    <form action={doLogout}>
        <button className="   rounded" type="submit">Logout</button>
    </form>
  )
}

export default Logout