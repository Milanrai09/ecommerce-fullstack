import { addProductApi } from "../api";

const addProduct={
    after_render:()=>{


        document.getElementById('addProduct-container')
        .addEventListener('submit',(e)=> {
            e.preventDefault();
            const formData = new FormData();

            // Append each form field to the FormData object
            formData.append('name', document.getElementById('name').value);
            formData.append('description', document.getElementById('description').value);
            formData.append('price', document.getElementById('price').value);
            formData.append('countInStock', document.getElementById('countInStock').value);
            formData.append('category', document.getElementById('category').value);
            formData.append('brand', document.getElementById('brand').value);
            formData.append('image', document.getElementById('image').files[0]); // Get the first file in the input
          

            addProductApi(formData);
            document.getElementById('addProduct-form').reset();
        })


    },

    render:()=> {
return`
        <div class="addProduct-container">
            <form id="addProduct-form">
                <ul>
                    <li>
                        <label for="name">Name</label>
                        <input type="text" id="name">
                    </li>
                    
                    <li>
                        <label for="description">Description</label>
                        <input type="text" id="description">
                    </li>

                    <li>
                        <label for="price">Price</label>
                        <input type="number" id="price">
                    </li>

                    <li>
                        <label for="countInStock">CountInStock</label>
                        <input type="number" id="countInStock">
                    </li>

                    <li>
                        <label for="category">Category</label>
                        <input type="text" id="category">
                    </li>

                    <li>
                        <label for="brand">Brand</label>
                        <input type="text" id="brand">
                    </li>
                    
                    <li>
                        <label for="image">Image</label>
                        <input type="file" id="image">
                    </li>

                    <button type="submit">Submit</button>
                </ul>
            </form>
        </div>

        `
    }
}
export default addProduct;