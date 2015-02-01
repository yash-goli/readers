from rest_framework import serializers


class CustomSerializer(object, serializers.ModelSerializer):

	model = None
	parse = None


	class Meta(object, CustomSerializer):
		def __init__(self, CustomSerializer):
			import pdb;pdb.set_trace()
		model = model

class GenericSerializer(CustomSerializer):

	def __init__(self, *args, **kwargs):
		import pdb;pdb.set_trace()
		# Super(GenericSerializer,self).__init__()
