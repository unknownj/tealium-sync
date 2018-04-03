# tealium-sync
Maintains synchronisation between local filesystem and Tealium IQ.

Notion of export templates:
  writeTemplate = function(template file, filename_resolution_function)
  
  writeTemplate('export_1.js',function(extension){ return extension.split("/").join("\_") + ".js"; });
  writeTemplate('export_1_test_wrapper.js',function(extension){ return extension.split("/").join("\_") + ".test.js"; });
