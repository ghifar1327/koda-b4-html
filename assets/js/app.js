define(["jquery"], function ($) {
  $(document).ready(() => {
    $("#btnTambahTugas").on("click", (e) => {
      e.preventDefault();
      $("#tambahTugas").toggleClass("hidden");
    });
  });

  $(document).ready(() => {
    $("#btnTanggal").on("click", (e) => {
      e.preventDefault();
      $("#btn-t1").toggleClass("hidden block");
      $("#btn-t2").toggleClass("block hidden");
      $("#optionTanggal").toggleClass("block hidden");
    });
  });

  $(document).ready(() => {
    $("#btnOption").on("click", (e) => {
      e.preventDefault();
      $("#optionRd").toggleClass("block hidden");
    });
  });
  $(document).ready(() =>{
    $('#btn-arrow1').on('click', (e)=>{
        e.preventDefault()
        $('#subtask').toggleClass('block hidden')
        $('#arrow1').toggleClass('hidden block')
        $('#arrow2').toggleClass('block hidden')
    })
  })
  $(document).ready(() =>{
    $('#btn-arrowFoot').on('click', (e)=>{
        e.preventDefault()
        $('#tComplete').toggleClass('block hidden')
        $('#btnFoot1').toggleClass('hidden block')
        $('#btnFoot2').toggleClass('block hidden')
    })
  })

});
