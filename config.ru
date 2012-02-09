# This file allows the current directory to be served up using a
# server that supports rack.

# For example using ruby and thin:
# $ gem install thin
# $ thin start
# You can now browse the files at http://0.0.0.0:3000

require 'rack-rewrite'

root=Dir.pwd
puts ">>> Serving: #{root}"
use Rack::Rewrite do
  rewrite '/', '/index.html'
end

run Rack::Directory.new("#{root}")
