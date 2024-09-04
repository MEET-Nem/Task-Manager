export const categories = {

    categoriesNameList: "",

        init: function () {
        categories.fetchCategoriesList();
    },

    fetchCategoriesList: async function(){
        try {
            const response = await fetch('http://127.0.0.1:8000/api/categories');
            const categoriesData = await response.json();
            for (const categoryData of categoriesData){
                categories.categoriesNameList += `<option value="${categoryData.id}">${categoryData.name}</div>`;
            }
        } catch(error) {
            console.log(error);
        }
    },
}

document.addEventListener("DOMContentLoaded", categories.init);