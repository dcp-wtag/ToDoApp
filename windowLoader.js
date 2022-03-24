var loader = document.getElementById('preloader');

window.addEventListener('load', function(){
    this.setTimeout(loading, 2000);
});

function loading() {
    loader.style.display = 'none';
    dbRowCount().then((result) => {
        for(var data of result) {
            if(data.is_completed == true) {
              completeTaskCount++;
            }
        }
      
        allTaskCount = result.length;
        incompleteTaskCount = allTaskCount - completeTaskCount;
      
        console.log(allTaskCount, completeTaskCount, incompleteTaskCount);
      });
}
async function dbRowCount() {
    const { data, count, error } = await supabase.from('todo').select('*', { count: 'exact' }).order('id',{ascending: false});
    return data;
}