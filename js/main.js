jQuery(document).ready(function(){

  displayResults(sortByRatio(data));

  manageSwitch();

});

function displayResults(localData)
{
  jQuery('#country-list li').not(':first').remove();
  var $model = jQuery('#country-list li:first');
  for(var i=0; i< localData.length; i++){
    var countryData = localData[i];
    $newLi = $model.clone();
    $newLi.addClass(countryData.countryCode);
    $newLi.find('.rank').text(countryData.rank);
    $newLi.find('.country').text(countryData.country);
    $newLi.find('.gold').html("<span>&#9679;</span>"+countryData.gold);
    $newLi.find('.silver').html("<span>&#9679;</span>"+countryData.silver);
    $newLi.find('.bronze').html("<span>&#9679;</span>"+countryData.bronze);
    $newLi.find('.population').text(countryData.population.formatPopulation(0,'',','));
    $newLi.find('.ratio').css('width', getBarSize(countryData));
    jQuery('#country-list').append($newLi);
  }
  $model.remove();
}

function manageSwitch()
{
  jQuery('#switch-rank').toggle(function(e){
    e.preventDefault();
    displayResults(sortByMedals(data));
    jQuery(this).html("&#9679; view medal count by country population");
  }, function(e){
    e.preventDefault();
    displayResults(sortByRatio(data));
    jQuery(this).html("&#9679; view official medal count");
  });
}

function sortByPopulation(localData)
{
  localData.sort(function(a, b){
    b.sortingValue = b.population;
    a.sortingValue = a.population;
    return b.sortingValue - a.sortingValue;
  });
  return getRanking(localData);
}

function sortByMedals(localData)
{
  localData.sort(function(a, b){
    b.sortingValue = getMedalScore(b);
    a.sortingValue = getMedalScore(a);
    return b.sortingValue - a.sortingValue;
  });
  return getRanking(localData);
}

function sortByRatio(localData)
{
  localData.sort(function(a, b){
    b.sortingValue = getRatio(b);
    a.sortingValue = getRatio(a);
    return b.sortingValue - a.sortingValue;
  });
  return getRanking(localData);
}

function getMedalScore(element)
{
  return element.gold*10000 + element.silver*100 + element.bronze;
}

function getRanking(localData)
{
  var previousRank = 1;
  var previousData = -1;
  for(var i=0; i<localData.length; i++){
    if(localData[i].sortingValue == previousData){
      localData[i].rank = previousRank;
    }else{
      localData[i].rank = i+1;
      previousRank = i+1;
      previousData = localData[i].sortingValue;
    }
  }
  return localData;
}

function getRatio(element)
{
  return getMedalScore(element) / element.population;
}

function getBarSize(element)
{
  var val = getRatio(element)*900000;
  return (val < 1)?1:Math.round(Math.sqrt(val));
}

Number.prototype.formatPopulation = function(c, d, t){
  var n = this, c = isNaN(c = Math.abs(c)) ? 2 : c, d = d == undefined ? "," : d, t = t == undefined ? "." : t, s = n < 0 ? "-" : "", i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", j = (j = i.length) > 3 ? j % 3 : 0;
  return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};

