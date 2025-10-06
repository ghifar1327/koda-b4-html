// app.js
define(["jquery"], function ($) {
  $(document).ready(() => {
    let currentTaskId = null;
    let currentDeleteId = null;
    let currentDeleteType = null;
    let currentSubtaskId = null;

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

    function openRenameModal(taskName) {
      $("#renameInput").val(taskName || "");
      $("#renameModal").removeClass("hidden");
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

    function openDeleteModal(type, itemName) {
      currentDeleteType = type;
      const message = type === 'task' 
        ? `Yakin mau hapus task "${itemName}"?` 
        : `Yakin mau hapus subtask "${itemName}"?`;
      $("#deleteMessage").text(message);
      $("#deleteModal").removeClass("hidden");
      setTimeout(() => {
        $("#deleteBox")
          .removeClass("scale-95 opacity-0")
          .addClass("scale-100 opacity-100");
      }, 20);
    }
    function closeDeleteModal() {
      $("#deleteBox")
        .removeClass("scale-100 opacity-100")
        .addClass("scale-95 opacity-0");
      setTimeout(() => {
        $("#deleteModal").addClass("hidden");
      }, 180);
      currentDeleteId = null;
      currentDeleteType = null;
      currentSubtaskId = null;
    }

    // Tambah subtask
    $(document).on("click", ".addSubtaskBtn", function (e) {
      e.preventDefault();
      const id = $(this).data("id");
      const $input = $(`#newSubtaskInput${id}`);
      const subName = $input.val().trim();
      if (!subName) return;

      let data = JSON.parse(localStorage.getItem("user task")) || [];
      if (!data[id].subtasks) data[id].subtasks = [];

      data[id].subtasks.push({ name: subName, done: false });
      localStorage.setItem("user task", JSON.stringify(data));

      const newSubtaskHtml = `
        <div class="flex gap-2 items-center justify-between">
          <label class="flex gap-2 cursor-pointer items-center flex-1">
            <input
              type="checkbox"
              class="subtask-check appearance-none w-4 h-4 border-2 border-orange-500 rounded-full 
                     checked:bg-orange-500 checked:border-orange-500 
                     checked:[background-image:url('assets/icons/checked.svg')] 
                     checked:bg-[length:70%_70%] bg-center bg-no-repeat cursor-pointer"
              data-task-id="${id}"
              data-sub-id="${data[id].subtasks.length - 1}"
            />
            <span>${subName}</span>
          </label>
          <button 
            class="deleteSubtaskBtn text-red-500 hover:text-red-700"
            data-task-id="${id}"
            data-sub-id="${data[id].subtasks.length - 1}"
            title="Hapus subtask"
          >
            <img src="assets/icons/Delete.png" alt="" class="w-3 h-4" />
          </button>
        </div>
      `;

      $(`#subtaskList${id}`).append(newSubtaskHtml);
      $input.val("");
    });

    // Render semua tasks
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
                    <button id="delTs${index}" class="flex gap-1 ml-1" data-id="${index}">
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
            <div class="mb-3 flex justify-between items-center">
             <p class="font-semibold">Subtask</p>
            </div>

            <div class="flex gap-2 mb-3">
              <input
                type="text"
                id="newSubtaskInput${index}"
                class="flex-1 border border-orange-400 rounded-md p-2 text-sm focus:outline-none"
                placeholder="Tulis subtask..."
              />
              <button
                class="addSubtaskBtn bg-orange-500 text-white text-xs rounded-md px-3"
                data-id="${index}"
              >
                Tambah
              </button>
            </div>

            <div id="subtaskList${index}" class="space-y-2">
              ${
                item.subtasks
                  ? item.subtasks
                      .map(
                        (sub, subIndex) => `
              <div class="flex gap-2 items-center justify-between">
                <label class="flex gap-2 cursor-pointer items-center flex-1">
                  <input
                    type="checkbox"
                    class="subtask-check appearance-none w-4 h-4 border-2 border-orange-500 rounded-full 
                    checked:bg-orange-500 checked:border-orange-500 
                    checked:[background-image:url('assets/icons/checked.svg')] 
                    checked:bg-[length:70%_70%] bg-center bg-no-repeat cursor-pointer"
                    data-task-id="${index}"
                    data-sub-id="${subIndex}"
                    ${sub.done ? "checked" : ""}
                  />
                  <span class="${
                    sub.done ? "line-through text-gray-400" : ""
                  }">
                    ${sub.name}
                  </span>
                </label>
                <button 
                  class="deleteSubtaskBtn text-red-500 hover:text-red-700"
                  data-task-id="${index}"
                  data-sub-id="${subIndex}"
                  data-subtask-name="${sub.name}"
                  title="Hapus subtask"
                >
                  <img src="assets/icons/Delete.png" alt="" class="w-3 h-4" />
                </button>
              </div>
              `
                      )
                      .join("")
                  : ""
              }
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

      $("#doneCount").text(
        `Terselesaikan (${data.filter((t) => t.done).length} Tugas)`
      );
    }

    // Checkbox task change
    $(document).on("change", ".task-check", function () {
      const id = Number($(this).data("id"));
      let data = JSON.parse(localStorage.getItem("user task")) || [];
      if (!data[id]) return;
      data[id].done = this.checked;
      localStorage.setItem("user task", JSON.stringify(data));
      renderTasks();
    });

    // Checkbox subtask change
    $(document).on("change", ".subtask-check", function () {
      const taskId = Number($(this).data("task-id"));
      const subId = Number($(this).data("sub-id"));

      let data = JSON.parse(localStorage.getItem("user task")) || [];
      if (
        !data[taskId] ||
        !data[taskId].subtasks ||
        !data[taskId].subtasks[subId]
      )
        return;

      data[taskId].subtasks[subId].done = this.checked;
      localStorage.setItem("user task", JSON.stringify(data));

      const $span = $(this).next("span");
      if (this.checked) {
        $span.addClass("line-through text-gray-400");
      } else {
        $span.removeClass("line-through text-gray-400");
      }
    });

    // Handler hapus subtask
    $(document).on("click", ".deleteSubtaskBtn", function (e) {
      e.preventDefault();
      const taskId = Number($(this).data("task-id"));
      const subId = Number($(this).data("sub-id"));
      const subtaskName = $(this).data("subtask-name");

      let data = JSON.parse(localStorage.getItem("user task")) || [];
      if (!data[taskId] || !data[taskId].subtasks) return;

      currentDeleteId = taskId;
      currentSubtaskId = subId;
      $("[id^=optionRd]").addClass("hidden");
      openDeleteModal('subtask', subtaskName);
    });

    // Show dropdown options
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

    // Rename handler
    $(document).on("click", "[id^=reNm]", function (e) {
      e.stopPropagation();
      const idAttr = $(this).attr("id");
      const id = Number(idAttr.replace("reNm", ""));
      let data = JSON.parse(localStorage.getItem("user task")) || [];
      if (!data[id]) return;
      currentTaskId = id;
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

    // Close modal when clicking outside
    $(document).on("click", "#renameModal", function (e) {
      if (e.target && e.target.id === "renameModal") {
        closeRenameModal();
      }
    });

    // Delete handler
    $(document).on("click", "[id^=delTs]", function (e) {
      e.stopPropagation();
      const idAttr = $(this).attr("id");
      const id = Number(idAttr.replace("delTs", ""));
      let data = JSON.parse(localStorage.getItem("user task")) || [];
      if (!data[id]) return;
      
      currentDeleteId = id;
      $("[id^=optionRd]").addClass("hidden");
      openDeleteModal('task', data[id].taskName);
    });

    // Cancel delete
    $(document).on("click", "#cancelDelete", function () {
      closeDeleteModal();
    });

    // Confirm delete
    $(document).on("click", "#confirmDelete", function () {
      let data = JSON.parse(localStorage.getItem("user task")) || [];

      if (currentDeleteType === 'task') {
        if (data[currentDeleteId]) {
          data.splice(currentDeleteId, 1);
          localStorage.setItem("user task", JSON.stringify(data));
          renderTasks();
        }
      } else if (currentDeleteType === 'subtask') {
        if (data[currentDeleteId] && data[currentDeleteId].subtasks) {
          data[currentDeleteId].subtasks.splice(currentSubtaskId, 1);
          localStorage.setItem("user task", JSON.stringify(data));
          renderTasks();
        }
      }

      closeDeleteModal();
    });

    // Close delete modal when clicking outside
    $(document).on("click", "#deleteModal", function (e) {
      if (e.target && e.target.id === "deleteModal") {
        closeDeleteModal();
      }
    });

    // Expand/Collapse subtask
    $(document).on("click", "[id^=btn-arrow1]", function () {
      const id = $(this).attr("id").replace("btn-arrow1", "");
      const $subtask = $(`#subtask${id}`);
      const $arrow1 = $(`#arrow1${id}`);
      const $arrow2 = $(`#arrow2${id}`);
      $subtask.toggleClass("hidden");
      $arrow1.toggleClass("hidden");
      $arrow2.toggleClass("hidden");
    });

    // Toggle list tugas selesai
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