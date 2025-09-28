define(["jquery"], function ($) {
  $(document).ready(() => {
    let currentTaskId = null;

    // Button tambah tugas
    (() => {
      const $btn = $("#btnTambahTugas");
      const $dropdown = $("#tambahTugas");

      $btn.on("click", (e) => {
        e.stopPropagation();
        $dropdown.toggleClass("hidden");
      });

      $(document).on("click", () => $dropdown.addClass("hidden"));
      $dropdown.on("click", (e) => e.stopPropagation());
    })();

    // Button by tanggal
    (() => {
      const $btn1 = $("#btn-t1");
      const $btn2 = $("#btn-t2");
      const $option = $("#optionTanggal");

      $btn1.on("click", (e) => {
        e.stopPropagation();
        $btn1.addClass("hidden");
        $btn2.removeClass("hidden");
        $option.removeClass("hidden");
      });

      $(document).on("click", () => {
        $option.addClass("hidden");
        $btn2.addClass("hidden");
        $btn1.removeClass("hidden");
      });

      $option.on("click", (e) => e.stopPropagation());
    })();

    // Form submit
    $("#form").on("submit", (e) => {
      e.preventDefault();

      const taskName = $("#taskName").val().trim();
      const deskp = $("#deskp").val().trim();
      const taskDate = $("#taskDate").val().trim();

      if (!taskName || !taskDate) {
        alert("Input tugas belum di isi");
        return;
      }

      const data = JSON.parse(localStorage.getItem("user task")) || [];
      data.push({ taskName, deskp, taskDate });
      localStorage.setItem("user task", JSON.stringify(data));

      $("#form")[0].reset();
      renderTasks();
    });

    // Render daftar tugas
    function renderTasks() {
      const $list = $("#newTask").empty();
      const data = JSON.parse(localStorage.getItem("user task")) || [];

      $.each(data, (index, item) => {
        $list.append(`
          <div class="flex justify-between m-5 relative">
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
                  <div
                    id="optionRd${index}"
                    class="border border-orange-500 text-orange-500 absolute top-8 z-5 right-0 md:left-40 rounded-md bg-orange-100 text-sm w-35 h-20 p-4 hidden"
                  >
                    <button id="reNm${index}" class="flex justify-between mb-2">
                      <img src="assets/icons/Edit.png" alt="" class="w-5" />
                      <p>Rename Task</p>
                    </button>
                    <button id="delTs${index}" class="flex gap-4">
                      <img src="assets/icons/Delete.png" alt="" class="w-3 h-4" />
                      <p>Delete task</p>
                    </button>
                  </div>
                </div>
                <div class="text-gray-400">${item.deskp}</div>
              </div>
            </div>
            <div id="btn-arrow1">
              <button id="arrow1">
                <img src="assets/icons/Arrow - Down 1.png" alt="" class="w-6" />
              </button>
              <button id="arrow2" class="hidden">
                <img src="assets/icons/Arrow - Up 2.png" alt="" class="w-3 m-1" />
            </button>
          </div>
          </div>
        `);
      });
    }

    // Show dropdown options
    $(document).on("click", ".btnOption", function (e) {
      e.stopPropagation();
      const id = $(this).data("id");

      $("[id^=optionRd]").not(`#optionRd${id}`).addClass("hidden");
      $(`#optionRd${id}`).toggleClass("hidden");
    });

    $(document).on("click", () => {
      $("[id^=optionRd]").addClass("hidden");
    });

    $(document).on("click", "[id^=optionRd]", function (e) {
      e.stopPropagation();
    });

    // Rename Task
    $(document).on("click", "[id^=reNm]", function () {
      const id = $(this).attr("id").replace("reNm", "");
      let data = JSON.parse(localStorage.getItem("user task")) || [];

      currentTaskId = id;
      $("#renameInput").val(data[id].taskName);
      $("#renameModal").removeClass("hidden");
    });

    $("#cancelRename").on("click", function () {
      $("#renameModal").addClass("hidden");
      currentTaskId = null;
    });

    $("#saveRename").on("click", function () {
      if (currentTaskId === null) return;

      let data = JSON.parse(localStorage.getItem("user task")) || [];
      const newName = $("#renameInput").val().trim();

      if (newName !== "") {
        data[currentTaskId].taskName = newName;
        localStorage.setItem("user task", JSON.stringify(data));
        renderTasks();
      }

      $("#renameModal").addClass("hidden");
      currentTaskId = null;
    });

    // Delete Task
    $(document).on("click", "[id^=delTs]", function () {
      const id = $(this).attr("id").replace("delTs", "");
      let data = JSON.parse(localStorage.getItem("user task")) || [];

      if (confirm("Yakin mau hapus task ini?")) {
        data.splice(id, 1);
        localStorage.setItem("user task", JSON.stringify(data));
        renderTasks();
      }
    });

    renderTasks();
  });
});

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
