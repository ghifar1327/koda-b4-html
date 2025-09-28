
$(document).ready(function () { // Tunggu sampai seluruh dokumen siap sebelum menjalankan script

  // Handle submit form
  $("#form").on("submit", function (e) { // Event listener ketika form dengan id="form" disubmit
    e.preventDefault(); // Mencegah form reload halaman default

    let name = $("#name").val(); // Ambil nilai input dengan id="name"
    let age = $("#age").val(); // Ambil nilai input dengan id="age"
    let gender = $('input[name="gender"]:checked').val() || "-"; // Ambil value radio button "gender" yang terpilih, kalau tidak ada isi "-"
    let smoker = $('input[name="smoker"]:checked').val() || "-"; // Ambil value radio button "smoker" yang terpilih, kalau tidak ada isi "-"

    let cigarettes = []; // Buat array kosong untuk menampung checkbox rokok
    $('input[name="cigarette"]:checked').each(function () { // Loop semua checkbox dengan name="cigarette" yang dicentang
      cigarettes.push($(this).val()); // Masukkan value checkbox ke dalam array
    });

    let data = JSON.parse(localStorage.getItem("surveyData")) || []; 
    // Ambil data lama dari localStorage (kalau ada), kalau kosong pakai array []

    data.push({ name, age, gender, smoker, cigarettes }); 
    // Tambahkan data baru ke array

    localStorage.setItem("surveyData", JSON.stringify(data)); 
    // Simpan array data ke localStorage dalam bentuk string JSON

    $("#form")[0].reset(); // Reset/clear isi form
    window.location.href = "table.html"; // Pindah ke halaman table.html setelah submit
  });

  // Load table data di halaman table.html
  let data = JSON.parse(localStorage.getItem("surveyData")) || []; 
  // Ambil data dari localStorage lagi (untuk ditampilkan di tabel)

  $.each(data, function (i, item) { // Loop setiap item di dalam array data
    $("#tbody").append( // Tambahkan baris baru ke tabel dengan id="tbody"
      `<tr>
        <td>${item.name}</td>        
        <td>${item.age}</td>        
        <td>${item.gender}</td>    
        <td>${item.smoker}</td>      
        <td>${item.cigarettes.join(", ")}</td>
      </tr>`
    );
  });
});
