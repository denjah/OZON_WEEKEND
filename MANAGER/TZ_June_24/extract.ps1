$word = New-Object -ComObject Word.Application
$word.Visible = $false
$doc = $word.Documents.Open("d:\!PROJECTS\OZON_MANAGER\MANAGER\TZ_June_24\ТЗ Оптимизация Интерфейса Матрицы.docx")
$doc.Content.Text | Out-File -FilePath "d:\!PROJECTS\OZON_MANAGER\MANAGER\TZ_June_24\tz_extracted.txt" -Encoding UTF8
$doc.Close()
$word.Quit()
