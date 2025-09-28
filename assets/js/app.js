// app.js
define(["jquery"], function ($) {
  $(document).ready(() => {
    let currentTaskId = null;

    // Button tambah tugas (toggle form)
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

    // Submit form tambah task
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
      data.push({ taskName, deskp, taskDate, done: false });
      localStorage.setItem("user task", JSON.stringify(data));
      $("#form")[0].reset();
      renderTasks();
    });

    // open/close rename modal with animation (styling unchanged)
    function openRenameModal(taskName) {
      $("#renameInput").val(taskName || "");
      $("#renameModal").removeClass("hidden");
      // animasi show (renameBox di HTML memiliki kelas scale-95 opacity-0)
      setTimeout(() => {
        $("#renameBox")
          .removeClass("scale-95 opacity-0")
          .addClass("scale-100 opacity-100");
      }, 20);
    }
    function closeRenameModal() {
      $("#renameBox")
        .removeClass("scale-100 opacity-100")
        .addClass("scale-95 opacity-0");
      setTimeout(() => {
        $("#renameModal").addClass("hidden");
      }, 180);
      currentTaskId = null;
    }

    // Render semua tasks (tidak mengubah styling)
    function renderTasks() {
      const $list = $("#newTask").empty();
      const $complete = $("#tComplete").empty();
      const data = JSON.parse(localStorage.getItem("user task")) || [];

      $.each(data, (index, item) => {
        if (item.done) {
          const doneHtml = `
         <label for="check-f${index}" class="flex gap-2 cursor-pointer">
        <input
          id="check-f${index}"
          type="checkbox"
          class="peer mt-1 bg-white appearance-none w-4 h-4 border-2 border-orange-500 rounded-full checked:bg-orange-500 checked:border-orange-500 checked:[background-image:url('assets/icons/checked.svg')] checked:bg-[length:70%_70%] bg-center bg-no-repeat cursor-pointer"
        />
        <span class="peer-checked:line-through">${item.taskName}</span>
      </label> `;
          $complete.append(doneHtml);
        } else {
          const taskHtml = `
          <div class="flex justify-between m-5 relative">
            <div class="flex gap-1">
              <div>
                <input
                  id="check-${index}"
                  type="checkbox"
                  data-id="${index}"
                  class="task-check mt-1 appearance-none w-4 h-4 border-2 border-orange-500 rounded-full 
                         checked:bg-orange-500 checked:border-orange-500 
                         checked:[background-image:url('assets/icons/checked.svg')] 
                         checked:bg-[length:70%_70%] bg-center bg-no-repeat cursor-pointer"
                  ${item.done ? "checked" : ""}
                />
              </div>
              <div>
                <div class="flex gap-1 mb-2">
                  <label for="check-${index}" class="${
            item.done ? "line-through text-gray-400" : ""
          }">${item.taskName}</label>
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
                    <button id="reNm${index}" class="flex justify-between mb-2" data-id="${index}">
                      <img src="assets/icons/Edit.png" alt="" class="w-5" />
                      <p>Rename Task</p>
                    </button>
                    <button id="delTs${index}" class="flex gap-4" data-id="${index}">
                      <img src="assets/icons/Delete.png" alt="" class="w-3 h-4" />
                      <p>Delete task</p>
                    </button>
                  </div>
                </div>
                <div class="text-gray-400">${item.deskp}</div>
              </div>
            </div>
            <div id="btn-arrow1${index}">
              <button id="arrow1${index}">
                <img src="assets/icons/Arrow - Down 1.png" alt="" class="w-6" />
              </button>
              <button id="arrow2${index}" class="hidden">
                <img src="assets/icons/Arrow - Up 2.png" alt="" class="w-3 m-1" />
              </button>
            </div>
          </div>

          <div class="m-5 bg-gray-200 p-5 rounded-md hidden" id="subtask${index}">
           <div class="flex justify-between items-center mb-5">
             <div>
              <p>Subtask</p>
              </div>
              <div>
                <button
                  class="rounded-3xl bg-white flex items-center p-2 text-orange-500 border h-8 text-xs"
                  >
                  <img src="assets/icons/Plus.png" alt="" class="w-3 mr-1" />
                  <div>Tambah</div>
                </button>
              </div>
            </div>
          </div>
        `;

          if (item.done) {
            $complete.append(taskHtml);
          } else {
            $list.append(taskHtml);
          }
        }
      });

      // update jumlah selesai (tetap styling sama)
      $("#doneCount").text(
        `Terselesaikan (${data.filter((t) => t.done).length} Tugas)`
      );
    }

    // Checkbox change → update done (delegated)
    $(document).on("change", ".task-check", function () {
      const id = Number($(this).data("id"));
      let data = JSON.parse(localStorage.getItem("user task")) || [];
      if (!data[id]) return;
      data[id].done = this.checked;
      localStorage.setItem("user task", JSON.stringify(data));
      renderTasks();
    });

    // Show dropdown options (per-task)
    $(document).on("click", ".btnOption", function (e) {
      e.stopPropagation();
      const id = $(this).data("id");
      $("[id^=optionRd]").not(`#optionRd${id}`).addClass("hidden");
      $(`#optionRd${id}`).toggleClass("hidden");
    });
    $(document).on("click", () => $("[id^=optionRd]").addClass("hidden"));
    $(document).on("click", "[id^=optionRd]", function (e) {
      e.stopPropagation();
    });

    // Rename handler (delegated) — this is fixed so modal opens reliably
    $(document).on("click", "[id^=reNm]", function (e) {
      e.stopPropagation();
      const idAttr = $(this).attr("id");
      const id = Number(idAttr.replace("reNm", ""));
      let data = JSON.parse(localStorage.getItem("user task")) || [];
      if (!data[id]) return;
      currentTaskId = id;
      // hide option dropdown so it won't overlap the modal
      $("[id^=optionRd]").addClass("hidden");
      openRenameModal(data[id].taskName);
    });

    // Close modal by Cancel
    $(document).on("click", "#cancelRename", function () {
      closeRenameModal();
    });

    // Save rename
    $(document).on("click", "#saveRename", function () {
      if (currentTaskId === null) return;
      let data = JSON.parse(localStorage.getItem("user task")) || [];
      const newName = $("#renameInput").val().trim();
      if (newName !== "") {
        data[currentTaskId].taskName = newName;
        localStorage.setItem("user task", JSON.stringify(data));
        renderTasks();
      }
      closeRenameModal();
    });

    // Also close modal when clicking outside the box (overlay)
    $(document).on("click", "#renameModal", function (e) {
      if (e.target && e.target.id === "renameModal") {
        closeRenameModal();
      }
    });

    // Delete handler (delegated)
    $(document).on("click", "[id^=delTs]", function (e) {
      e.stopPropagation();
      const idAttr = $(this).attr("id");
      const id = Number(idAttr.replace("delTs", ""));
      let data = JSON.parse(localStorage.getItem("user task")) || [];
      if (!data[id]) return;
      if (confirm("Yakin mau hapus task ini?")) {
        data.splice(id, 1);
        localStorage.setItem("user task", JSON.stringify(data));
        renderTasks();
      }
    });

    // Expand/Collapse subtask (preserve id pattern & styling)
    $(document).on("click", "[id^=btn-arrow1]", function () {
      const id = $(this).attr("id").replace("btn-arrow1", "");
      const $subtask = $(`#subtask${id}`);
      const $arrow1 = $(`#arrow1${id}`);
      const $arrow2 = $(`#arrow2${id}`);
      $subtask.toggleClass("hidden");
      $arrow1.toggleClass("hidden");
      $arrow2.toggleClass("hidden");
    });

    // Toggle list tugas selesai (footer)
    $("#btn-arrowFoot").on("click", (e) => {
      e.preventDefault();
      $("#tComplete").toggleClass("block hidden");
      $("#btnFoot1").toggleClass("hidden block");
      $("#btnFoot2").toggleClass("block hidden");
    });

    // initial render
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

//======================
// `
//           <div class="flex justify-between m-5 relative">
//             <div class="flex gap-1">
//               <div>
//                 <input
//                   id="check-${index}"
//                   type="checkbox"
//                   class="mt-1 appearance-none w-4 h-4 border-2 border-orange-500 rounded-full
//                          checked:bg-orange-500 checked:border-orange-500
//                          checked:[background-image:url('assets/icons/checked.svg')]
//                          checked:bg-[length:70%_70%] bg-center bg-no-repeat cursor-pointer"
//                 />
//               </div>
//               <div>
//                 <div class="flex gap-1 mb-2">
//                   <label for="check-${index}">${item.taskName}</label>
//                   <div class="rounded-3xl bg-orange-100 flex items-center p-3 h-4 text-orange-500 gap-1 border text-xs">
//                     ${item.taskDate}
//                   </div>
//                   <button class="btnOption" data-id="${index}">
//                     <img src="assets/icons/more-vertical.png" alt="" />
//                   </button>
//                   <div
//                     id="optionRd${index}"
//                     class="border border-orange-500 text-orange-500 absolute top-8 z-5 right-0 md:left-40 rounded-md bg-orange-100 text-sm w-35 h-20 p-4 hidden"
//                   >
//                     <button id="reNm${index}" class="flex justify-between mb-2">
//                       <img src="assets/icons/Edit.png" alt="" class="w-5" />
//                       <p>Rename Task</p>
//                     </button>
//                     <button id="delTs${index}" class="flex gap-4">
//                       <img src="assets/icons/Delete.png" alt="" class="w-3 h-4" />
//                       <p>Delete task</p>
//                     </button>
//                   </div>
//                 </div>
//                 <div class="text-gray-400">${item.deskp}</div>
//               </div>
//             </div>
//             <div id="btn-arrow1${index}">
//               <button id="arrow1${index}">
//                 <img src="assets/icons/Arrow - Down 1.png" alt="" class="w-6" />
//               </button>
//               <button id="arrow2${index}" class="hidden">
//                 <img src="assets/icons/Arrow - Up 2.png" alt="" class="w-3 m-1" />
//             </button>
//           </div>
//           </div>

//           <div class="m-5 bg-gray-200 p-5 rounded-md hidden" id="subtask${index}">
//            <div class="flex justify-between items-center mb-5">
//              <div>
//               <p>Subtask</p>
//               </div>
//               <div>
//                 <button
//                   class="rounded-3xl bg-white flex items-center p-2 text-orange-500 border h-8 text-xs"
//                   >
//                   <img src="assets/icons/Plus.png" alt="" class="w-3 mr-1" />
//                   <div>Tambah</div>
//                 </button>
//               </div>
//             </div>
//           </div>
//         `

// // Rename Task
// $(document).on("click", "[id^=reNm]", function () {
//   const id = $(this).attr("id").replace("reNm", "");
//   let data = JSON.parse(localStorage.getItem("user task")) || [];

//   currentTaskId = id;
//   $("#renameInput").val(data[id].taskName);
//   $("#renameModal").removeClass("hidden");
// });

// $("#cancelRename").on("click", function () {
//   $("#renameModal").addClass("hidden");
//   currentTaskId = null;
// });

// $("#saveRename").on("click", function () {
//   if (currentTaskId === null) return;

//   let data = JSON.parse(localStorage.getItem("user task")) || [];
//   const newName = $("#renameInput").val().trim();

//   if (newName !== "") {
//     data[currentTaskId].taskName = newName;
//     localStorage.setItem("user task", JSON.stringify(data));
//     renderTasks();
//   }

//   $("#renameModal").addClass("hidden");
//   currentTaskId = null;
// });
