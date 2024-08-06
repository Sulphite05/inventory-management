'use client'
import Image from "next/image";
import { useState, useEffect } from "react";
import { firestore, Firestore } from "@/firebase";
import { Box, Typography } from "@mui/material";
import { collection, getDocs, query } from "firebase/firestore";

export default function Home() {
  const [inventory, setInventory] = useState([]); // state variable to store inventory
  const [open, setOpen] = useState(false); // state variable for our bottle which will be used to add and remove stuff
  const [itemName, setItemName] = useState(''); // to store the nae of item we type out
  // inside useState, we give default value

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push(
        {
          name: doc.id,
          ...doc.data(),   //...doc.data(): This is the spread operator. It takes all the properties from the object returned by doc.data() and spreads them into the new object. doc.data() returns the data of the document as a plain JavaScript object.
        }
      )
    })
    setInventory(inventoryList);
  }

  useEffect(() => {
    updateInventory();
  }, []); // runs when the dependency array changes but since its empty, this will function only once
  // async means it won't block our code when its fetching otherwise our whole website might freeze

  return <Box>
    <Typography variant="h1">Inventory Management</Typography>
  </Box>
}
