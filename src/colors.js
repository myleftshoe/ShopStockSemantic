const color = (tag) => {
    let color="";
    switch (tag) {
        case "Citrus" : {
            color = "#F2711F";
            break;
        }
        case "Leafy Greens" : {
            color = "DarkGreen"
            break; 
        }
        case "Berries and Grapes" : {
            color = "#6538C8"
            break;
        }        
        case "Apples and Pears" : {
            color = "#B3CB1C"
            break;
        }        
        case "Fruit Vegetable" : {
            color = "#00B3AC"
            break;
        }        
        case "Root Vegetable" : {
            color = "#A236C7"
            break;
        }        
        case "Stone Fruit" : {
            color = "#2884CF"
            break;
        }        
        case "Potatoes and Onions" : {
            color = "#A46741"
            break;
        }        
        case "Tropical Fruit and Melons" : {
            color = "#FBBC05"
            break;
        }   
        case "Sprouts" : {
            color = "#DF3C95"
            break;
        }        
        case "Cruciferous" : {
            color = "#23B947"
            break;
        }           
        case "Herbs" : {
            color = "Green"
            break;
        }           
        case "Mushrooms" : {
            color = "Tan"
            break;
        }              
        case "Salad" : {
            color = "MediumSeaGreen"
            break;
        }  
        case "Peas and Beans" : {
            color = "OliveDrab"
            break;
        }  
        case "Misc. Fruit" : {
            color = "Tomato"
            break;
        }  
        case "Stems and Roots" : {
            color = "Peru"
            break;
        }
        case "Tomatoes" : {
            color = "Maroon"
            break;
        }  
        default : color = "";
    }
    return color;
}

export default color;