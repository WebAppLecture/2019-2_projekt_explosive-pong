//übernommen mit freundlicher Genehmigung von Max Huber
    export default function getRandom(min, max){
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min);
    }