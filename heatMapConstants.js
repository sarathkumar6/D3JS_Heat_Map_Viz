export function hmConstants () {
    const colors =  ["#a50026","#d73027","#f46d43","#fdae61","#fee090","#ffffbf","#e0f3f8","#abd9e9","#74add1","#4575b4","#313695"],
          months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    return {
        getUrl: 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json',
        getColors: colors,
        getRevColors: colors.reverse(),
        getMonths: months,
        getPadding: {
            top : 110,
            bottom: 80,
            left: 80,
            right: 80
        }
    }
}