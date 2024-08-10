'use client'
import { useState, useEffect } from 'react'
import { Box, Stack, Typography, IconButton, Modal, TextField } from '@mui/material'
import { Add, Remove, Edit } from '@mui/icons-material'
import { firestore } from '@/firebase'
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore'

// Galactic theme styles
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'rgba(0, 0, 0, 0.8)',
  color: '#fff',
  border: '2px solid #fff',
  boxShadow: '0 0 20px rgba(255, 255, 255, 0.8)',
  p: 4,
  borderRadius: '15px',
  backdropFilter: 'blur(10px)',
};

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');


  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
  }

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    await updateInventory();
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }
    await updateInventory();
  }

  const editItemName = async (oldName, newName) => {
    const oldDocRef = doc(collection(firestore, 'inventory'), oldName);
    const newDocRef = doc(collection(firestore, 'inventory'), newName);
    const oldDocSnap = await getDoc(oldDocRef);

    if (oldDocSnap.exists()) {
      const data = oldDocSnap.data();
      await setDoc(newDocRef, data); // Create new document with updated name
      await deleteDoc(oldDocRef); // Delete old document
    }
    await updateInventory();
    setEditMode(false);
    setCurrentItem(null);
  }

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setEditMode(false);
    setItemName('');
  };

  const filteredInventory = inventory.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      gap={2}
      sx={{
        background: 'linear-gradient(to bottom, #000428, #004e92)',
        backgroundImage: 'url(/milky-way.avif)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: '#fff',
      }}
    >
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {editMode ? 'Edit Item Name' : 'Add Item'}
          </Typography>
          <Stack width="100%" direction={'row'} spacing={2}>
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              sx={{
                input: { color: '#fff' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#fff',
                  },
                  '&:hover fieldset': {
                    borderColor: '#fff',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#fff',
                  },
                },
              }}
            />
            <IconButton
              color="primary"
              onClick={() => {
                if (editMode) {
                  editItemName(currentItem, itemName);
                } else {
                  addItem(itemName);
                }
                handleClose();
              }}
              sx={{
                color: '#fff',
                backgroundColor: '#1a237e',
                '&:hover': {
                  backgroundColor: '#303f9f',
                },
              }}
            >
              {editMode ? <Edit /> : <Add />}
            </IconButton>
          </Stack>
        </Box>
      </Modal>
      <Box display="flex" flexDirection="column" alignItems="center">
        <IconButton
          color="primary"
          onClick={handleOpen}
          sx={{
            bgcolor: 'rgba(229,95,208, 0.7)',
            '&:hover': {
              bgcolor: 'rgba(229,95,208,0.9)',
            },
            borderRadius: '50%',
            color: '#fff',
            boxShadow: '0 0 20px rgba(255, 255, 255, 0.5)',
          }}
        >
          <Add fontSize="large" />
        </IconButton>

        {/* Search Input */}
        <TextField
          id="search-input"
          label="Search Item"
          // color='white'
          variant="outlined"
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            input: { color: '#fff' },
            '& .MuiInputLabel-root': {
              color: '#fff', // Change label color here
            },
            input: { color: '#fff' },
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#fff',
              },
              '&:hover fieldset': {
                borderColor: '#fff',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#fff',
              },
            },
          }}
          margin="normal"
        />
      </Box>
      <Box
        border={'1px solid #fff'}
        borderRadius={'15px'}
        overflow="hidden"
        boxShadow="0 0 20px rgba(255, 255, 255, 0.5)"
        sx={{
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(5px)',
        }}
      >
        <Box
          width="800px"
          height="100px"
          bgcolor={'rgba(255, 255, 255, 0.1)'}
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
        >
          <Typography variant={'h2'} color={'#fff'} textAlign={'center'}>
            Inventory Items
          </Typography>
        </Box>
        <Stack
          width="800px"
          height="300px"
          spacing={2}
          overflow={'auto'}
          p={2}
          sx={{
            scrollbarColor: 'rgba(255, 255, 255, 0.3) rgba(0, 0, 0, 0.3)',
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
              borderRadius: '10px',
            },
          }}
        >
          {filteredInventory.map(({ name, quantity }) => (
            <Box
              key={name}
              width="100%"
              minHeight="150px"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              backgroundColor="rgba(255, 255, 255, 0.1)"
              padding="0 20px"
              borderRadius="8px"
              boxShadow="0 2px 5px rgba(255, 255, 255, 0.3)"
            >
              <Typography variant={'h4'} color={'#fff'} sx={{
                flex:1,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '150px', // Adjust based on your layout
              }}>
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant={'h4'} color={'#fff' } >
                Quantity: {quantity}
              </Typography>
              <Stack direction="row" spacing={1}>
                <IconButton
                  color="primary"
                  onClick={() => addItem(name)}
                  sx={{
                    color: '#fff',
                    backgroundColor: 'rgba(0, 150, 136, 0.7)',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 150, 136, 1)',
                    },
                  }}
                >
                  <Add />
                </IconButton>
                <IconButton
                  color="default"
                  onClick={() => {
                    setEditMode(true);
                    setCurrentItem(name);
                    setItemName(name);
                    handleOpen();
                  }}
                  sx={{
                    color: '#fff',
                    backgroundColor: 'rgba(63, 81, 181, 0.7)',
                    '&:hover': {
                      backgroundColor: 'rgba(63, 81, 181, 1)',
                    },
                  }}
                >
                  <Edit />
                </IconButton>
                <IconButton
                  color="secondary"
                  onClick={() => removeItem(name)}
                  sx={{
                    color: "#fff",
                    backgroundColor: "rgba(244, 67, 54, 0.7)",
                    "&:hover": {
                      backgroundColor: "rgba(244, 67, 54, 1)",
                    },
                  }}>
                    <Remove/>
                </IconButton>
              </Stack>
            </Box>))}
        </Stack>
      </Box>
    </Box>)
}
