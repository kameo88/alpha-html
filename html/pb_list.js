
$(function(){
			
    $('title').text($('.tab_nav li.on a').text() + " | +알파");
    $('h1').append($('.tab_nav li.on a').text());

    $.each($("td.url > a"), function(i,v){
        var state = $(v).closest('tr').attr('class');
        if(/ing|com|end|mod/i.test(state)) {
            $(v).text($(v).attr("href"));
        } else {
            $(v).after($(v).attr("href"));
        }
    });
    

    var locN = $('tbody tr').length;
    var locHidn = $('tbody tr.hid').length;
    var locEd = $('tbody tr.end').length + $('tbody tr.mod').length;
    var locNa = locN - locHidn;
    var locTotalC = locEd / locNa;
    var locTotal = Math.round(locTotalC.toFixed(2) * 100);
    
    $('.proc_wrap').append('<div class=\"proc\"><p>페이지 수 : <strong>' + locNa + '</strong></p><p>완료된 페이지 수 : <strong>' + locEd + '</strong></p><p>진행율  : <strong>' + locTotal + ' %</strong></p></div>');
    

    var $target = $('h2');
    
    $target.each(function (index, element) {
        var $parent = $(this);
        var tarN = $parent.next().find('tbody tr').length;
        var tarHidn = $parent.next().find('tbody tr.hid').length;
        var tarEd = $parent.next().find('tbody tr.end').length + $parent.next().find('tbody tr.mod').length;
        var tarNa = tarN - tarHidn;
        var tarTotalC = tarEd / tarNa;
        var tarTotal = Math.round(tarTotalC.toFixed(2) * 100);

        $parent.append('<div class=\"proc\">' + tarNa + ' &nbsp;&nbsp;&nbsp ' + tarEd + ' / '  + tarTotal + '%</div>');
    });
});