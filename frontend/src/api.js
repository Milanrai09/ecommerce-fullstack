
const API_URL = 'http://localhost:3000'
const apiUrl = API_URL;
export async function getUsersApi() {
  try {

    if (!apiUrl) {
      throw new Error('API URL is not defined in the environment variables');
    }

    const response = await fetch(`${apiUrl}/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('hello form the user api');

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const result = await response.json();
    console.log('Fetched users:', result);

    return result;
  } catch (error) {
    return { error: error.message };
  }
}
export async function loginUser (loginData){
    try{
        const {email,password} = loginData;
        console.log('login data ', {email,password});
        const response = await fetch(`${apiUrl}/api/users/login`,{ 
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({email,password})
        })

        if(response.status !== 200){
            console.error('login failed')
            return{
                status:501,
                message:'login failed'
            }
        }else{
            const result = await response.json();
            const {message,userData} = result
            localStorage.setItem('ecommerceToken',JSON.stringify(userData))
            return {
                status: 200,
                results:result,
                message:'login successful'
            };
        }
    }
    catch(error){
        return {error:error.message}
    }
}

export async function registerUser(registerData) {
    try {
        console.log('register data', registerData);
        const { name, email, password } = registerData;
        const registerDatas = { name, email, password };
        console.log(name, email, password);
        
        const response = await fetch(`${apiUrl}/api/users/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(registerDatas),
        });
        
        if (response.status !== 201) {
            console.error('registration failed');
            return {
                status: 501,
            };
        } else {
            const result = await response.json();
            const data = result.sendData
            localStorage.setItem('ecommerceToken', JSON.stringify(data));

            return {
                status: 201,
                results:result
            };
        }
    } catch (error) {
        console.error('Error during registration:', error);
        return { error: error.message };
    }
}
export const createProduct = async (productData) => {
  try {
    const formData = new FormData();
    
    // Append all product data to formData
    Object.keys(productData).forEach(key => {
      formData.append(key, productData[key]);
    });

    // Get userId from localStorage
    const userId = JSON.parse(localStorage.getItem('ecommerceToken')).id;
    formData.append('userId', userId);

    const response = await fetch(`${apiUrl}/api/product/addProduct`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Failed to create product');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

export const getProductApi = async (productId = null) => {
    try {
      let url = `${apiUrl}/api/admin/getProduct`;
      if (productId) {
        url += `/${productId}`;
      }
  
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
  
      return productId ? data.product || data : data.products || data;
    } catch (error) {
      console.error('Error fetching product(s):', error);
      return productId ? null : [];
    }
  };


export const getOrderList = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/admin/order`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('ecommerceToken');
        throw new Error('Unauthorized access. Please log in again.');
      }
  
      if (!response.ok) {
        throw new Error('Failed to update order');
      }
  
      const data = await response.json();

      return data;
    } catch (error) {
      console.error('Error fetching order list:', error);
      return { data: [] };
    }
  };



  export async function updateOrder(updateOrder) {
    try {
      const userId = JSON.parse(localStorage.getItem('ecommerceToken'));
  
      if (!userId) {
        throw new Error('No authentication token found. Please log in.');
      }
  
      const response = await fetch(`${apiUrl}/api/admin/updateOrder`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userId}` // Assuming it's a Bearer token
        },
        body: JSON.stringify({ updateOrder }),
      });
  
      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('ecommerceToken');
        throw new Error('Unauthorized access. Please log in again.');
      }
  
      if (!response.ok) {
        throw new Error('Failed to update order');
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error updating order:', error);
      throw error;
    }
  }
  export async function updateProduct(updatedProducts) {
    try {
      console.log(updatedProducts)
      const response = await fetch(`${apiUrl}/api/admin/products/updateProduct`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({updatedProducts}),
      });
      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('ecommerceToken');
        throw new Error('Unauthorized access. Please log in again.');
      }
  

      if (!response.ok) {
        throw new Error('Failed to update order');
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

export async function editUserApi(editUserId,){
    try{
        console.log(editUserId)
        const response = await fetch(`${apiUrl}/api/admin/promote/${editUserId}`,{
            method:'PUT',
            headers:{
                'Content-Type':'application/json',
            },
        })

        if(!response.ok){
            throw new Error('the network response failed')
        }
        const result = await response.json();
        return result;
    }catch(error){
        return {error:error.messgae};
    }
}


// export async function searchProduct(searchInputData){
//     try{
//         const response = await fetch(`${apiUrl}`,{
//             method:'POST',
//             headers:{
//                 'Content-Type':'application/json',
//             },

//             body: JSON.stringify(searchInputData),
//         })
//         if(!response.ok){
//             throw new Error('the network response failed')
//         }
//         const result = await response.json();
//         return result;
//     }catch(error){
//         return {error:error.messgae}
//     }
// }


export async function checkout (data){
    try {
        const response = await fetch(`${apiUrl}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();
        return result;


    } catch (error) {
        console.error('Error:', error);
    }
}



export async function logoutApi(){
    try{
            const response  = await fetch(`${apiUrl}`,{
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                },
        
            })

            if (response.ok) {
                // Optionally, perform UI updates or redirect to login page
                console.log('Logged out successfully');
            } else {
                console.error('Logout failed');
            }

    }catch(error){
        console.error('faile to logout',error.message);
    }

}


export async function getProductSection(category){
    let url = `${apiUrl}/api/products`;
    if (category) {
        url += `?section=${category}`;
    }

    try {
        const response = await fetch(url);
        const products = await response.json();
        displayProducts(products);
    }catch(error){
        return{message:error.message};
    }
}

export async function deleteProduct(id){

    try{
        
        const response = await fetch(`${apiUrl}/api/admin/removeProduct/${id}`,{
            method:'DELETE',

        });
        if (response.ok) {
            // Optionally, perform UI updates or redirect to login page
            console.log('deletion successfully');
        } else {
            console.error('deletion failed');
        }
    }catch(error){
        return{error:error.message}
    }
}


export async function removeUser(id){

    try{

        const response = await fetch(`${apiUrl}/api/admin/removeUser/${id}`, {
            method: 'DELETE', // or 'POST', depending on your API endpoint
            headers: {
              'Content-Type': 'application/json',
              // Add any other required headers, such as authentication tokens
            },
          });
        if (response.ok) {
            // Optionally, perform UI updates or redirect to login page
            console.log('deletion successfully');
            return{
                status:200,
            }
        } else {
            console.error('deletion failed');
        }
    }catch(error){
        return{error:error.message}
    }
}




export const createOrder = async (orderData) => {
    try {
      const token = localStorage.getItem('ecommerceToken');
      if (!token) {
        return { message: 'No token found' };
      }
      const userid = JSON.parse(token).id;
      const response = await fetch(`${apiUrl}/api/order/createorders/${userid}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });
      return await response.json();
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  };





  export const getUserInfo = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/admin/users`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();


      return data;
    } catch (error) {
      console.error('Error fetching user info:', error);
      return { data: [] };
    }
  };


  export const addToCart = async(data) => {
    try{
        const cartDatas = data
        const response = await fetch(`${apiUrl}/api/users/addtocart`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(cartDatas),
        });
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem('ecommerceToken');
          throw new Error('Unauthorized access. Please log in again.');
        }
    
        if (!response.ok) {
          throw new Error('Failed to update order');
        }
    

        const result = await response.json();
      
        if(!result){
            console.log("error cart not saved",result)
            return{message:"cart not saved"}
        }
        return{message:"cart is saved"}





    }catch(error){
        console.error(error)
        return{message:error,}
    }
  }


  export const getCart = async () => {
    try {
      const token = localStorage.getItem('ecommerceToken');
      if (!token) {
        return { message: 'No token found' };
      }
      const userid = JSON.parse(token).id;

      const response = await fetch(`${apiUrl}/api/cart/${userid}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('ecommerceToken');
        throw new Error('Unauthorized access. Please log in again.');
      }
  
      if (!response.ok) {
        const result = await response.json();
        console.log(result)
        return { status: response.status, message: result.message };
      }

  
      const cartdata = await response.json();
      console.log(cartdata)
      return { cart: cartdata};
  
    } catch (error) {
      console.error(error);
      return { message: 'Failed to get cart list' };
    }
  };

export const getUserOrder = async () => {
    try {
        const token = localStorage.getItem('ecommerceToken');
        if (!token) {
          return { message: 'No token found' };
        }
        const userid = JSON.parse(token).id;
        const response = await fetch(`${apiUrl}/api/order/${userid}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',

            },
        });
        const data = await response.json();
        return data; // This will return the entire response object including status and data
    } catch (error) {
        return { status: 500, data: [], error: 'Failed to fetch orders' };
    }
};



export const cancelUserOrder = async (id) => {
console.log(id)
    try{

        const response = await fetch(`${apiUrl}/api/admin/cancel/${id}`,{
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
        },
}
    )
        const data = await response.json();
        return data;
      
    }catch(error){
        return { status: 500, data: [], error: 'Failed to fetch orders' };

    }
}


export const searchProducts = async (query) => {
    try {
      const response = await fetch(`${apiUrl}/api/product/search?q=${encodeURIComponent(query)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
      }
  
      const data = await response.json();
      return data;
  
    } catch (error) {
      console.error('Error searching products:', error);
      return [];
    }
  };


  export const removeCart = async (id) => {
    try {

      const response = await fetch(`${apiUrl}/api/cart/removeCart/${id}`, {
        method: 'DELETE', // Use DELETE method instead of PUT
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to remove cart');
      }
  
      return { message: 'Cart removed successfully' };
    } catch (error) {
      console.error(error);
      return { message: 'Failed to remove cart' };
    }
  }


  export const updateQuantity = async (cartId, productId, newQuantity) => {
    console.log(cartId, productId, newQuantity)
    try {
      const response = await fetch(`${apiUrl}/api/cart/update-quantity/${cartId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, quantity: newQuantity }),
      });
      if (!response.ok) {
        throw new Error('Failed to update quantity');
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating quantity:', error);
      return { error: error.message };
    }
  };



  export const getPaticularProduct = async (id) => {
    try{
      const response = await fetch(`${apiUrl}/api/product/idProduct/${id}`,{
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if(!response){
        throw new Error('Failed to update quantity');
      }

      const results = await response.json();
      
      return results;

    }catch(error){
      console.error( error);
      return { error: error.message };
    }
  }