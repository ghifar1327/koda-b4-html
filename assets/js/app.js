define(["jquery"], function ($) {
  $(document).ready(() => {
    // Toggle form tambah tugas
    $("#btnTambahTugas").on("click", (e) => {
      e.stopPropagation();
      e.preventDefault();
      $("#tambahTugas").toggleClass("hidden");
    });
    $(document).ready(() => {
      $("#btnTanggal").on("click", (e) => {
        e.preventDefault();
        $("#btn-t1").toggleClass("hidden block");
        $("#btn-t2").toggleClass("block hidden");
        $("#optionTanggal").toggleClass("block hidden");
      });
    });

    $("#form").on("submit", (e) => {
      e.preventDefault();

      let taskName = $("#taskName").val().trim();
      let deskp = $("#deskp").val().trim();
      let taskDate = $("#taskDate").val().trim();

      //Cek kalau input kosong
      if (taskName === "" || taskDate === "") {
        alert("Input tugas belum di isi");
        return;
      }

      let data = JSON.parse(localStorage.getItem("user task")) || [];

      // Simpan data hanya kalau valid
      data.push({ taskName, deskp, taskDate });
      localStorage.setItem("user task", JSON.stringify(data));
      console.log("Data tersimpan:", data);

      $("#form")[0].reset();
      renderTasks();
    });

    // Fungsi render daftar tugas
    function renderTasks() {
      $("#newTask").empty();
      let data = JSON.parse(localStorage.getItem("user task")) || [];

      $.each(data, (index, item) => {
        $("#newTask").append(
          `<div class="flex justify-between m-5">
            <div class="flex gap-1">
              <div>
                <input
                  id="check-${index}"
                  type="checkbox"
                  class="mt-1 appearance-none w-4 h-4 border-2 border-orange-500 rounded-full 
                         checked:bg-orange-500 checked:border-orange-500 
                         checked:[background-image:url('assets/icons/checked.svg')] 
                         checked:bg-[length:70%_70%] bg-center bg-no-repeat cursor-pointer"
                />
              </div>
              <div>
                <div class="flex gap-1 mb-2">
                  <label for="check-${index}">${item.taskName}</label>
                  <div class="rounded-3xl bg-orange-100 flex items-center p-3 h-4 text-orange-500 gap-1 border text-xs">
                    ${item.taskDate}
                  </div>
                  <button class="btnOption" data-id="${index}">
                    <img src="assets/icons/more-vertical.png" alt="" />
                  </button>
                </div>
                <div class="text-gray-400">${item.deskp}</div>
              </div>
            </div>
            <div class="btn-arrow">
              <button class="arrow1" data-id="${index}">
                <img src="assets/icons/Arrow - Down 1.png" alt="" class="w-6" />
              </button>
              <button class="arrow2 hidden" data-id="${index}">
                <img src="assets/icons/Arrow - Up 2.png" alt="" class="w-3 m-1"/>
              </button>
            </div>
          </div>`
        );
      });
    }
    renderTasks();
  });
});

// $(document).ready(() => {
//   $("#btnOption").on("click", (e) => {
//     e.preventDefault();
//     $("#optionRd").toggleClass("block hidden");
//   });
// });
// $(document).ready(() =>{
//   $('#btn-arrow1').on('click', (e)=>{
//       e.preventDefault()
//       $('#subtask').toggleClass('block hidden')
//       $('#arrow1').toggleClass('hidden block')
//       $('#arrow2').toggleClass('block hidden')
//   })
// })
// $(document).ready(() =>{
//   $('#btn-arrowFoot').on('click', (e)=>{
//       e.preventDefault()
//       $('#tComplete').toggleClass('block hidden')
//       $('#btnFoot1').toggleClass('hidden block')
//       $('#btnFoot2').toggleClass('block hidden')
//   })
// })
