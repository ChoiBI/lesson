
$('.list').click(function(e) {
    tapOpen(e.target.dataset.id)
})

function tapOpen(i) {
$(".tab-button").removeClass("orange");
$(".tab-button").eq(i).addClass("orange");
$(".tab-content").removeClass("show");
$(".tab-content").eq(i).addClass("show");
}