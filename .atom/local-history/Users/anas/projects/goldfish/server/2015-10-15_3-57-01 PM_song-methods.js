Meteor.methods({
  saveAudio: function(mediaObj){
    Audio.insert(mediaObj,function(err,fileObj){
      return fileObj;
    });
  },
  deleteAudio: function (AudioId) {
    Audio.remove(AudioId);
  },
});
Meteor.publish('stream', function(stream){

  					File f = new File("out.wav");
  					// if the file already exists we append it.
  					if (f.exists()) {
  						LOG.info("Adding received block to existing file.");
   
  						// two clips are used to concat the data
  						 AudioInputStream clip1 = AudioSystem.getAudioInputStream(f);
  						 AudioInputStream clip2 = AudioSystem.getAudioInputStream(new ByteArrayInputStream(data));
   
  						 // use a sequenceinput to cat them together
  						 AudioInputStream appendedFiles = 
  		                            new AudioInputStream(
  		                                new SequenceInputStream(clip1, clip2),     
  		                                clip1.getFormat(), 
  		                                clip1.getFrameLength() + clip2.getFrameLength());
   
  						 // write out the output to a temporary file
  		                    AudioSystem.write(appendedFiles, 
  		                            AudioFileFormat.Type.WAVE,
  		                            new File("out2.wav"));
   
  		                    // rename the files and delete the old one
  		                    File f1 = new File("out.wav");
  		                    File f2 = new File("out2.wav");
  		                    f1.delete();
  		                    f2.renameTo(new File("out.wav"));
  					} else {
  						LOG.info("Starting new recording.");
  						FileOutputStream fOut = new FileOutputStream("out.wav",true);
  						fOut.write(data);
  						fOut.close();
  					}			
  				} catch (Exception e) {	...}
  			}
  		}

});
