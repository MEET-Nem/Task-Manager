export const tags = {

    tagsNameList: "",

        init: function () {
        tags.fetchTagsList();
    },

    fetchTagsList: async function(){
        try {
            const response = await fetch('http://127.0.0.1:8000/api/tags');
            const tagsData = await response.json();
            for (const tagData of tagsData){
                tags.tagsNameList += `<input type="checkbox" class="checkbox" id="${tagData.id}" name="tag_id" value="${tagData.id}" > ${tagData.name} </input>`
            }
        } catch(error) {
            console.log(error);
        }
    },
}

document.addEventListener("DOMContentLoaded", tags.init);