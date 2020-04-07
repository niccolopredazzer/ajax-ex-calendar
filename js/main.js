$(document).ready(function () {

    var htmlGiorno = $('#calendar-template').html();
    var templateGiorno = Handlebars.compile(htmlGiorno);

    // Stampare il mese di Gennaio 2018
    // Tramite click stampare il mese successivo

    var dataIniziale = moment('2018-01-01');
stampaGiorniMese(dataIniziale); // Inizializzazione Calendario

var mese = dataIniziale.month();
stampaFestivi(mese);

var limiteIniziale = moment('2018-01-01');
var limiteFinale = moment('2018-12-31');
var limiteMese = moment('2018-11-30');

$('.mese-succ').prop('disabled', false);

$('.mese-succ').click(function () {
    $('.mese-prec').prop('disabled', false);
    dataIniziale.add(1, 'month');

    if (dataIniziale.isSameOrAfter(limiteFinale)) {
        alert('Hai provato ad hackerarmi! :( ');
    } else if (dataIniziale.isAfter(limiteMese)) {
        var meseSelezionato = dataIniziale.month();
        stampaGiorniMese(dataIniziale, meseSelezionato);
        stampaFestivi(meseSelezionato);
        $('.mese-succ').prop('disabled', true);
    } else {
        stampaGiorniMese(dataIniziale, meseSelezionato);
        stampaFestivi(meseSelezionato);
    }
});

$('.mese-prec').click(function () {
    $('.mese-succ').prop('disabled', false);
    if(dataIniziale.isSameOrBefore(limiteIniziale)){
         alert('Hai provato ad hackerarmi! :( ');
    } else {
    dataIniziale.subtract(1, 'month');
    var meseSelezionato = dataIniziale.month();
    stampaGiorniMese(dataIniziale, meseSelezionato);
    stampaFestivi(meseSelezionato);
    if(dataIniziale.isSameOrBefore(limiteIniziale)) {
       $('.mese-prec').prop('disabled', true);
  }
}
});

    function stampaFestivi(mese) {
        $.ajax({
            url: 'https://flynn.boolean.careers/exercises/api/holidays',
            method: 'GET',
            data: {
                year: 2018,
                month: mese
            },
            success: function (data) {
                var giorniFestivi = data.response;
                for (var i = 0; i < giorniFestivi.length; i++) {
                    var giornoFestivo = giorniFestivi[i];
                    var nomeFestivo = giornoFestivo.name;
                    var dataFestivo = giornoFestivo.date;
                    $('#calendar li[data-day="' + dataFestivo + '"]').addClass('festivo').append(' - ' + nomeFestivo);
                }
            }
        });
    }

    function stampaGiorniMese(meseDaStampare) {
        $('#calendar').empty();
        var annoCorrente = meseDaStampare.year();
        if (annoCorrente == 2018) {
            var standardDay = meseDaStampare.clone();
            var giorniMese = meseDaStampare.daysInMonth();
            var nomeMese = meseDaStampare.format('MMMM');
            $('#nome-mese').text(nomeMese);
            var giornoCorrispettivo = moment(meseDaStampare).isoWeekday()
            for (var i = 0; i < (giornoCorrispettivo - 1); i++) {
                $('#calendar').append('<li></li>');
            }
            for (var i = 1; i <= giorniMese; i++) {
                // $('#calendar').append('<li>' + i + ' ' + nomeMese + '</li>');
                var giornoDaInserire = {
                    day: i + ' ' + nomeMese,
                    dataDay: standardDay.format('YYYY-MM-DD')
                }
                var templateUltimo = templateGiorno(giornoDaInserire); // Stiamo popolando il template con i dati dell'oggetto
                $('#calendar').append(templateUltimo);
                standardDay.add(1, 'day');
            }
        } else {
            alert ('errore');
        }

    }

});
