Sekrebel Aksara Nusantara
===
This is a scrabble game for learning aksara nusantara. Currently available for Aksara Jawa.

Ini adalah permainan skrabel untuk belajar aksara nusantara. Saat ini baru tersedia Aksara Jawa.

Iki dolanan skrebel kanggo sinau aksara nusantara. Saiki lagi ana Aksara Jawa.


Deploy
---
- `git clone https://github.com/lantip/sekrebel.git`
- `cd sekrebel`
- Tambahkan gambar-gambar di folder `gambar`. Usahakan formatnya transparan dan dalam ukuran sekecil mungkin. Ukuran maksimal 150 x 150 pixel.
- Ubah file `constants.example` menjadi `constants.js`
- Tambahkan konstanta di dalam file `constants.js` sesuai gambar-gambar yang Anda tambahkan di folder `gambar`. Ikuti bentuk/format di dalam file tersebut.
- Folder/direktori `bahasa-indonesia` adalah sekrebel aksara nusantara untuk versi Bahasa Indonesia. Silakan lakukan langkah yang sama seperti di atas untuk menambahkan gambar di direktori tersebut.

Adding Characters
---
- Karakter-karakter aksara ada di dalam direktori `glyph`. Silakan ubah atau tambahkan isinya.
- Untuk agar karakter Anda masuk ke dalam `game`, ubah file `index.html` baik yang di direktori ini maupun di direktori `bahasa-indonesia`. Gunakan format sebagai berikut:
>
    <div class="box-cell"><img id="drag40"  draggable="true" src="glyph/o.svg" data-letter="ꦎ"
                alt="ꦎ"></div>

Fonta
---
- fonta ada di dalam direktori `fonts`.
- Jika ingin mengubah, gunakan fonta yang sudah mendukung unicode aksara nusantara. Anda bisa memakai fonta yang ada di [https://aksaradinusantara.com/](https://aksaradinusantara.com/)
- Sesuaikan file `css` di dalam direktori tersebut, juga `style.css` di dalam direktori `css`.

Programming Language
---
- HTML
- CSS
- Vanila JS

Thanks To
---
- [omahaksara.id](https://www.omahaksara.id) 
- [rajapatni.com](https://rajapatni.com/)