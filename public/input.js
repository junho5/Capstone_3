function inputCheck(){
    var temp = document.getElementById('plant_temperature');
    var water = document.getElementsByName('plant_water');
    var height = document.getElementsByName('plant_height');
    var width = document.getElementsByName('plant_width');
    var toxicity = document.getElementsByName('plant_toxicity');
    var light = document.getElementsByName('plant_light');
    var sel_water = null;
    var sel_height = null;
    var sel_width = null;
    var sel_toxicity = null;
    var sel_light = null;
    for(var i =0;i<water.length;i++){
        if(water[i].checked ==true){
            sel_water = water[i].value
        }
    }
    if(sel_water ==null){
        alert("물주기 난이도를 선택하세요")
        return false;
    }
    if (temp.value==""){
        alert("온도를 입력하세요");
        temp.focus();
        return false;
    }else {
        if(temp.value<5 || temp.value>35){
            alert("온도를 조건에 맞게 입력하세요")
            temp.focus();
            return false;
        }
    }
    for(var i =0;i<height.length;i++){
        if(height[i].checked ==true){
            sel_height = height[i].value
        }
    }
    if(sel_height ==null){
        alert("높이를 선택하세요")
        return false;
    } 
    for(var i =0;i<width.length;i++){
        if(width[i].checked ==true){
            sel_width = width[i].value
        }
    }
    if(sel_width ==null){
        alert("너비를 선택하세요")
        return false;
    } 
    for(var i =0;i<light.length;i++){
        if(light[i].checked ==true){
            sel_light = light[i].value
        }
    }
    if(sel_light ==null){
        alert("배치장소를 선택하세요")
        return false;
    } 
    for(var i =0;i<toxicity.length;i++){
        if(toxicity[i].checked ==true){
            sel_toxicity = toxicity[i].value
        }
    }
    if(sel_toxicity ==null){
        alert("독성여부를 선택하세요")
        return false;
    } 
    
    
}